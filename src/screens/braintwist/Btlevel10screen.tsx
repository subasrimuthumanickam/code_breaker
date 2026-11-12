
// // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,Easing,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // import {Stage,Coin} from './BTShared';
// // import {Icon} from './Art';
// // import {BigStar} from './Btlevel7art';
// // import {Grid,XMark,OMark,StrikeLine} from './Btlevel10art';
// // import {startLevel10,hintLevel10,finishLevel10,skipLevel10,rewardLevel10,Level10View,Level10Result,Level10Action} from './Btlevel10api';
// // import {Board,Dir,Status,tap as playTap,tilt,tiltMoves,status as boardStatus,winLine} from './Btlevel10logic';
// // import {RoomBackground,THEME} from './Btlevel4Theme';

// // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // const CHALK='#f6f4ea';

// // // clue shown in the CLUES popup when the magnifier (search icon) is tapped
// // const CLUE_1='Your rival is one move away from victory… can you spot the place you need to protect?';

// // type Props={
// //   playerId:number;
// //   hints?:number;
// //   setHints?:(n:number)=>void;
// //   onExit:()=>void;
// //   onComplete?:(result:Level10Result)=>void;
// // };

// // type Piece={id:number;kind:number;cell:number};

// // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// // const ARROW_DEG:Record<Dir,string>={R:'0deg',D:'90deg',L:'180deg',U:'270deg'};

// // export default function BTLevel10Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// //   const {width,height}=useWindowDimensions();
// //   const RW=Math.min(width-24,360);
// //   const BS=Math.floor(clamp(Math.min(RW-60,height-430),170,280));   // the tic-tac-toe board in pixels
// //   const cs=BS/3;                                   // one square
// //   const ms=cs*0.8;                                 // size of an X or an O

// //   const [view,setView]=useState<Level10View|null>(null);
// //   const [sessionId,setSessionId]=useState<number|null>(null);
// //   const [loadErr,setLoadErr]=useState('');
// //   const [msg,setMsg]=useState('');
// //   const [done,setDone]=useState(false);
// //   const [pieces,setPieces]=useState<Piece[]>([]);
// //   const [line,setLine]=useState<number[]|null>(null);
// //   const [hintDir,setHintDir]=useState<Dir|null>(null);
// //   const [result,setResult]=useState<Level10Result|null>(null);
// //   const [confirmSkip,setConfirmSkip]=useState(false);
// //   const [clueOpen,setClueOpen]=useState(false);
// //   const [clueText,setClueText]=useState(CLUE_1);   // clue text comes from the backend response

// //   const pop=useRef(new Animated.Value(0)).current;
// //   const bob=useRef(new Animated.Value(0)).current;

// //   const geo=useRef({cs});
// //   geo.current={cs};
// //   const boardRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);     // the board as it is now
// //   const initialRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);   // the start board (restart goes back here)
// //   const actionsRef=useRef<Level10Action[]>([]);          // what the player did since the last restart
// //   const piecesRef=useRef<Piece[]>([]);
// //   const idRef=useRef(0);
// //   const posRef=useRef<Record<number,Animated.ValueXY>>({});
// //   const popRef=useRef<Record<number,Animated.Value>>({});
// //   const busyRef=useRef(false);
// //   const doneRef=useRef(false);
// //   const sessionRef=useRef<number|null>(null);
// //   const timers=useRef<any[]>([]);
// //   const msgTimer=useRef<any>(null);
// //   const later=(fn:()=>void,ms2:number)=>{timers.current.push(setTimeout(fn,ms2))};

// //   const flash=(m:string)=>{
// //     setMsg(m);clearTimeout(msgTimer.current);
// //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// //   };

// //   const setP=(list:Piece[])=>{piecesRef.current=list;setPieces(list)};
// //   const cellXY=(c:number)=>({x:(c%3)*geo.current.cs,y:Math.floor(c/3)*geo.current.cs});

// //   // a new X or O on the board
// //   const addPiece=(kind:number,cell:number)=>{
// //     const id=++idRef.current;
// //     posRef.current[id]=new Animated.ValueXY(cellXY(cell));
// //     popRef.current[id]=new Animated.Value(0);
// //     Animated.spring(popRef.current[id],{toValue:1,friction:4,tension:90,useNativeDriver:true}).start();
// //     setP([...piecesRef.current,{id,kind,cell}]);
// //   };

// //   // draw a whole board without animation
// //   const rebuild=(b:Board)=>{
// //     posRef.current={};popRef.current={};
// //     const list:Piece[]=[];
// //     b.forEach((v,i)=>{
// //       if(!v)return;
// //       const id=++idRef.current;
// //       posRef.current[id]=new Animated.ValueXY(cellXY(i));
// //       popRef.current[id]=new Animated.Value(1);
// //       list.push({id,kind:v,cell:i});
// //     });
// //     setP(list);
// //   };

// //   // 1. open the level - the backend picks a start board every time
// //   const load=useCallback(()=>{
// //     setLoadErr('');setView(null);
// //     startLevel10(playerId)
// //       .then(v=>{
// //         initialRef.current=v.board.slice();
// //         boardRef.current=v.board.slice();
// //         actionsRef.current=[];
// //         busyRef.current=false;
// //         doneRef.current=false;
// //         setDone(false);setResult(null);setLine(null);setHintDir(null);
// //         rebuild(v.board);
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

// //   // the screen size changed: put every piece on its square again
// //   useEffect(()=>{
// //     piecesRef.current.forEach(p=>{const v=posRef.current[p.id];if(v)v.setValue(cellXY(p.cell))});
// //   },[cs]);                                         // eslint-disable-line react-hooks/exhaustive-deps

// //   useEffect(()=>{
// //     const b=Animated.loop(Animated.sequence([
// //       Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
// //       Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
// //     b.start();
// //     return()=>{b.stop()};
// //   },[]);

// //   useEffect(()=>{
// //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// //   },[result]);

// //   // 2. X won: send what the player did, the backend plays it again and saves the win
// //   const finish=async(attempt:number)=>{
// //     const sid=sessionRef.current;
// //     if(!sid)return;
// //     try{
// //       const r=await finishLevel10({sessionId:sid,playerId,actions:actionsRef.current.slice()});
// //       if(setHints&&typeof r.hints==='number')setHints(r.hints);
// //       setDone(true);
// //       later(()=>setResult(r),1300);
// //     }catch(e:any){
// //       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
// //       doneRef.current=false;
// //       flash(e.message||'Network error. Try again.');
// //       later(restart,1600);
// //     }
// //   };
// //   const finishRef=useRef(finish);
// //   finishRef.current=finish;

// //   // go back to the start board
// //   const restart=()=>{
// //     boardRef.current=initialRef.current.slice();
// //     actionsRef.current=[];
// //     setLine(null);setHintDir(null);
// //     rebuild(boardRef.current);
// //     busyRef.current=false;
// //   };

// //   // what happens after a move
// //   const settle=(s:Status)=>{
// //     if(s==='play'){busyRef.current=false;return}
// //     if(s==='win'){
// //       doneRef.current=true;
// //       setConfirmSkip(false);
// //       setLine(winLine(boardRef.current,1));
// //       finishRef.current(0);
// //       return;
// //     }
// //     flash(s==='lose'?'The rival wins! Try again...':'A draw is not a win! Try again...');
// //     later(restart,1700);
// //   };

// //   // tap a square: X goes there and the rival answers
// //   const onTap=(c:number)=>{
// //     if(busyRef.current||doneRef.current)return;
// //     const b=boardRef.current;
// //     if(b[c]!==0){flash('That square is taken!');return}
// //     busyRef.current=true;
// //     setHintDir(null);
// //     actionsRef.current.push({t:'tap',c});
// //     const r=playTap(b,c);
// //     boardRef.current=r.board;
// //     addPiece(1,c);
// //     if(r.rival>=0)later(()=>addPiece(2,r.rival),380);
// //     later(()=>settle(r.status),r.rival>=0?900:450);
// //   };

// //   // swipe the board: every piece slides to that side
// //   const onSwipe=(d:Dir)=>{
// //     if(busyRef.current||doneRef.current)return;
// //     const b=boardRef.current;
// //     const moves=tiltMoves(b,d);
// //     if(!moves.some(m=>m.from!==m.to)){flash('Nothing can slide that way');return}
// //     busyRef.current=true;
// //     setHintDir(null);
// //     actionsRef.current.push({t:'swipe',d});
// //     const nb=tilt(b,d);
// //     boardRef.current=nb;

// //     const to:Record<number,number>={};
// //     const anims:Animated.CompositeAnimation[]=[];
// //     moves.forEach(m=>{
// //       to[m.from]=m.to;
// //       if(m.from===m.to)return;
// //       const pc=piecesRef.current.find(p=>p.cell===m.from);
// //       const v=pc&&posRef.current[pc.id];
// //       if(v)anims.push(Animated.timing(v,{toValue:cellXY(m.to),duration:340,easing:Easing.out(Easing.cubic),useNativeDriver:true}));
// //     });
// //     Animated.parallel(anims).start(()=>{
// //       setP(piecesRef.current.map(p=>({...p,cell:to[p.cell]!==undefined?to[p.cell]:p.cell})));
// //       settle(boardStatus(nb));
// //     });
// //   };

// //   const onTapRef=useRef(onTap);onTapRef.current=onTap;
// //   const onSwipeRef=useRef(onSwipe);onSwipeRef.current=onSwipe;
// //   const gl=useRef({x:0,y:0});

// //   // touch on the board: a short touch = tap a square, a drag = swipe the board
// //   const pan=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// //     onPanResponderTerminationRequest:()=>false,
// //     onPanResponderGrant:(e)=>{
// //       gl.current={x:e.nativeEvent.locationX,y:e.nativeEvent.locationY};
// //       setConfirmSkip(false);
// //     },
// //     onPanResponderRelease:(_e,g)=>{
// //       const dist=Math.hypot(g.dx,g.dy);
// //       if(dist<14){
// //         const q=geo.current;
// //         const col=clamp(Math.floor(gl.current.x/q.cs),0,2),row=clamp(Math.floor(gl.current.y/q.cs),0,2);
// //         onTapRef.current(row*3+col);
// //       }else if(dist>=26){
// //         const d:Dir=Math.abs(g.dx)>Math.abs(g.dy)?(g.dx>0?'R':'L'):(g.dy>0?'D':'U');
// //         onSwipeRef.current(d);
// //       }
// //     },
// //   })).current;

// //   // magnifier (search icon): frontend -> POST /hint -> backend saves it in the database -> JSON back -> popup opens
// //   const onHint=async()=>{
// //     if(done||!sessionId)return;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await hintLevel10({sessionId,playerId,board:boardRef.current});
// //       if(typeof r.hints==='number'&&setHints)setHints(r.hints);
// //       setClueText(r.clue||CLUE_1);
// //       if(r.dir){
// //         setHintDir(r.dir);
// //         later(()=>setHintDir(null),6000);
// //       }
// //       setClueOpen(true);
// //     }catch(e:any){
// //       // backend refused (for example not enough hints) or network problem
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   // video reward (+75 hints) - only adds hints, never opens the clue popup
// //   const onReward=async()=>{
// //     if(done)return;
// //     setConfirmSkip(false);
// //     try{
// //       const r=await rewardLevel10(playerId);
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
// //       const r=await skipLevel10({sessionId,playerId});
// //       setHints&&setHints(r.hints||0);
// //       doneRef.current=true;
// //       onComplete?onComplete(r):onExit();
// //     }catch(e:any){
// //       setConfirmSkip(false);
// //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// //     }
// //   };

// //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// //   const header=(
// //     <View style={st.topBar}>
// //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// //         <Icon n="home" s={16}/>
// //       </TouchableOpacity>

// //       <View style={st.signWrap}>
// //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 10</Text>
// //           <Text style={st.signArrow}>{'>'}</Text>
// //         </View>
// //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// //       </View>

// //       <View style={st.pill}>
// //         <Text style={st.pillT}>{hints}</Text>
// //         <Text style={st.pillIcon}>💡</Text>
// //       </View>
// //     </View>
// //   );

// //   /* ---------- loading / error ---------- */

// //   if(loadErr||!view){
// //     return <Stage bg="#bddaee"><View style={st.root}>
// //       <RoomBackground/>
// //       {header}
// //       <View style={st.centerMsg}>
// //         {loadErr?<>
// //           <Text style={st.err}>{loadErr}</Text>
// //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// //         </>:<>
// //           <ActivityIndicator size="large" color={THEME.orange}/>
// //           <Text style={st.load}>Loading level 10...</Text>
// //         </>}
// //       </View>
// //     </View></Stage>;
// //   }

// //   const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
// //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

// //   return <Stage bg="#bddaee"><View style={st.root}>
// //     <RoomBackground/>
// //     {header}

// //     <View style={st.center}>
// //       {/* question pill (same as level 1) */}
// //       <View style={st.qPill}>
// //         <Text style={st.qArrow}>{'<'}</Text>
// //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// //         <Text style={st.qArrow}>{'>'}</Text>
// //       </View>

// //       {/* a small chalkboard on the wall: who is who + the tic-tac-toe board */}
// //       <View style={st.chalk}>
// //         <View style={st.legend}>
// //           <View style={st.lg}><XMark s={34}/><Text style={st.lgt}>: YOU</Text></View>
// //           <View style={st.lg}><OMark s={34}/><Text style={st.lgt}>: RIVAL</Text></View>
// //         </View>

// //         <View style={{marginTop:8,width:BS,height:BS}}>
// //           <Grid size={BS}/>

// //           {pieces.map(p=>{
// //             const pos=posRef.current[p.id],pp=popRef.current[p.id];
// //             if(!pos||!pp)return null;
// //             return <Animated.View key={p.id} pointerEvents="none"
// //               style={{position:'absolute',left:0,top:0,width:cs,height:cs,alignItems:'center',justifyContent:'center',
// //                 transform:[...pos.getTranslateTransform(),{scale:pp}]}}>
// //               {p.kind===1?<XMark s={ms}/>:<OMark s={ms}/>}
// //             </Animated.View>;
// //           })}

// //           {!!line&&<View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line}/></View>}

// //           {/* magnifier: which way to swipe */}
// //           {!!hintDir&&<View pointerEvents="none" style={[StyleSheet.absoluteFill,{alignItems:'center',justifyContent:'center'}]}>
// //             <Animated.Text style={{fontSize:76,color:'#ffd33d',opacity:0.85,fontWeight:'bold',
// //               transform:[{rotate:ARROW_DEG[hintDir]},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>
// //           </View>}

// //           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// //         </View>
// //       </View>
// //     </View>

// //     {/* bottom rounded panel (same as level 1) */}
// //     <View style={st.panel}>
// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
// //           <Icon n="film" s={36}/>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// //       </View>

// //       <View style={st.btnCol}>
// //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// //         </TouchableOpacity>
// //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// //       </View>
// //     </View>

// //     {/* CLUES popup (only from the magnifier / search icon) */}
// //     {clueOpen&&<View style={st.overlay}>
// //       <View style={st.clueCard}>
// //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// //           <Text style={st.closeT}>✕</Text>
// //         </TouchableOpacity>
// //         <Text style={st.clueTitle}>CLUES</Text>

// //         <View style={[st.clueRow,st.clueRowOpen]}>
// //           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// //           <View style={{flex:1}}>
// //             <Text style={st.clueHead}>Clue 1</Text>
// //             <Text style={st.clueBody}>{clueText}</Text>
// //           </View>
// //         </View>
// //       </View>
// //     </View>}

// //     {/* result card */}
// //     {!!result&&<View style={st.overlay}>
// //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// //         <Text style={st.cardTitle}>Level complete!</Text>
// //         <Text style={st.cardMsg}>{result.message}</Text>
// //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// //         <Text style={st.cardScore}>Score {result.score}</Text>
// //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// //           <Text style={st.nextT}>NEXT</Text>
// //         </TouchableOpacity>
// //       </Animated.View>
// //     </View>}
// //   </View></Stage>;
// // }

// // /* =========================================================
// //    STYLES  (same room theme as Level 1)
// // ========================================================= */

// // const st=StyleSheet.create({
// //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// //   pillIcon:{fontSize:16},

// //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
// //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

// //   chalk:{backgroundColor:'#1f5b44',borderWidth:6,borderColor:'#d98b3d',borderRadius:14,paddingHorizontal:14,paddingTop:10,paddingBottom:14,alignItems:'center'},
// //   legend:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:26},
// //   lg:{flexDirection:'row',alignItems:'center',gap:4},
// //   lgt:{fontFamily:FONT,fontSize:20,fontWeight:'bold',color:CHALK},

// //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// //   btnCol:{alignItems:'center'},
// //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

// //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// //   stars:{flexDirection:'row',gap:6,marginTop:14},
// //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // });
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// } from 'react-native';
// import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { Stage, F, Coin } from './BTShared';
// import { Icon } from './Art';
// import { BigStar } from './Btlevel5art';
// import { Grid, XMark, OMark, StrikeLine } from './Btlevel10art';
// import { startLevel10, hintLevel10, finishLevel10, skipLevel10, rewardLevel10, Level10View, Level10Result, Level10Action } from './Btlevel10api';
// import { Board, Dir, Status, tap as playTap, tilt, tiltMoves, status as boardStatus, winLine } from './Btlevel10logic';
// import { play } from './BTSound';

// const FONT: any = F;
// const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
// const CHALK = '#f6f4ea';

// /* garden palette (same as Level 5 / Level 9) */
// const NAVY = '#13235b';
// const SKY = '#5cc0f5';
// const CREAM = '#faf0e2';
// const CREAM_BORDER = '#ead2a4';
// const WOOD = '#eba24e';
// const WOOD_D = '#c2782c';
// const WOOD_DD = '#8f5a1f';
// const LIME = '#a4e02a';
// const LIME_RING = '#f4f1dc';
// const RED = '#f0434d';
// const ARROW = '#ffb629';
// const BADGE = '#6b4423';
// const GREEN_OK = '#3ec45a';
// const YEL_BTN = '#fbc02d';
// const YEL_BTN_D = '#d98e1c';

// // clue shown in the CLUES popup when the magnifier (search icon) is tapped
// const CLUE_1 = 'Your rival is one move away from victory… can you spot the place you need to protect?';

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit: () => void;
//   onComplete?: (result: Level10Result) => void;
// };

// type Piece = { id: number; kind: number; cell: number };

// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
// const ARROW_DEG: Record<Dir, string> = { R: '0deg', D: '90deg', L: '180deg', U: '270deg' };

// /* ---------- garden background (same as Level 5 / Level 9) ---------- */
// function Flower({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       {[0, 72, 144, 216, 288].map((a) => (
//         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
//       ))}
//       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
//     </G>
//   );
// }

// function Tuft({ x, y }: any) {
//   return (
//     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
//       <Polygon points="-14,0 -8,-34 -2,0" />
//       <Polygon points="-4,0 4,-44 12,0" />
//       <Polygon points="8,0 18,-30 24,0" />
//     </G>
//   );
// }

// function Cloud({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
//       <Ellipse cx="0" cy="0" rx="70" ry="26" />
//       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
//       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
//     </G>
//   );
// }

// function Sprout({ x, y, s = 1 }: any) {
//   return (
//     <G transform={`translate(${x} ${y}) scale(${s})`}>
//       <G fill="#5cb85c">
//         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
//         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
//         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
//       </G>
//       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
//       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
//       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
//       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
//       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
//       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
//     </G>
//   );
// }

// function Garden() {
//   return (
//     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//       {/* full-height sky */}
//       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
//         <Defs>
//           <LinearGradient id="g10sky" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0" stopColor="#46b6f3" />
//             <Stop offset="1" stopColor="#c2e8fb" />
//           </LinearGradient>
//         </Defs>
//         <Rect width="10" height="10" fill="url(#g10sky)" />
//       </Svg>

//       {/* trees + cloud, pinned to the top */}
//       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
//         <Svg width="100%" height="100%" viewBox="0 0 942 330">
//           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
//           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
//           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
//           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
//           <Cloud x={850} y={245} s={1} />
//         </Svg>
//       </View>

//       {/* ground: hills, fence, bookshelf, sprout, meadow */}
//       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
//         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
//           <Cloud x={50} y={585} s={0.9} />
//           <Cloud x={880} y={600} s={0.6} />

//           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
//           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
//           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

//           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
//             const x = -10 + i * 90;
//             return (
//               <G key={i}>
//                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
//               </G>
//             );
//           })}
//           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
//           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

//           <G>
//             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
//             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
//             <G fill="#4cb04a">
//               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
//               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
//               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
//             </G>
//             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
//             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
//             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
//             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
//             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
//             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
//             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
//             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
//             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
//             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
//             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
//             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
//             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
//           </G>

//           <Sprout x={10} y={740} s={1} />

//           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
//           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

//           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
//           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
//           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

//           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
//           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
//           <Flower x="885" y="815" s={0.8} />
//           <Flower x="200" y="1225" s={0.95} />
//           <Flower x="735" y="1225" s={0.95} />
//         </Svg>
//       </View>
//     </View>
//   );
// }

// /* ---------- thin link chain for the hanging sign ---------- */
// function Chain({ h = 28, style }: { h?: number; style?: any }) {
//   const n = Math.max(2, Math.round(h / 8));
//   return (
//     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
//       {Array.from({ length: n }).map((_, i) => (
//         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
//       ))}
//     </Svg>
//   );
// }

// /* ---------- double arrow (skip icon) ---------- */
// function DoubleArrow({ s }: { s: number }) {
//   return (
//     <Svg width={s} height={s} viewBox="0 0 100 100">
//       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
//     </Svg>
//   );
// }

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function BTLevel10Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
//   const { width, height } = useWindowDimensions();
//   const RW = Math.min(width - 24, 360);
//   const BS = Math.floor(clamp(Math.min(RW - 60, height - 450), 170, 280));   // the tic-tac-toe board in pixels
//   const cs = BS / 3;                               // one square
//   const ms = cs * 0.8;                             // size of an X or an O

//   const [view, setView] = useState<Level10View | null>(null);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [loadErr, setLoadErr] = useState('');
//   const [msg, setMsg] = useState('');
//   const [done, setDone] = useState(false);
//   const [pieces, setPieces] = useState<Piece[]>([]);
//   const [line, setLine] = useState<number[] | null>(null);
//   const [hintDir, setHintDir] = useState<Dir | null>(null);
//   const [result, setResult] = useState<Level10Result | null>(null);
//   const [confirmSkip, setConfirmSkip] = useState(false);
//   const [clueOpen, setClueOpen] = useState(false);
//   const [clueText, setClueText] = useState(CLUE_1);   // clue text comes from the backend response

//   const pop = useRef(new Animated.Value(0)).current;
//   const bob = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;

//   const geo = useRef({ cs });
//   geo.current = { cs };
//   const boardRef = useRef<Board>([0, 0, 0, 0, 0, 0, 0, 0, 0]);     // the board as it is now
//   const initialRef = useRef<Board>([0, 0, 0, 0, 0, 0, 0, 0, 0]);   // the start board (restart goes back here)
//   const actionsRef = useRef<Level10Action[]>([]);                  // what the player did since the last restart
//   const piecesRef = useRef<Piece[]>([]);
//   const idRef = useRef(0);
//   const posRef = useRef<Record<number, Animated.ValueXY>>({});
//   const popRef = useRef<Record<number, Animated.Value>>({});
//   const busyRef = useRef(false);
//   const doneRef = useRef(false);
//   const sessionRef = useRef<number | null>(null);
//   const timers = useRef<any[]>([]);
//   const msgTimer = useRef<any>(null);
//   const later = (fn: () => void, ms2: number) => { timers.current.push(setTimeout(fn, ms2)); };

//   const flash = (m: string) => {
//     setMsg(m); clearTimeout(msgTimer.current);
//     msgTimer.current = setTimeout(() => setMsg(''), 2800);
//   };

//   // hanging sign sways gently (same as Level 5 / Level 9)
//   useEffect(() => {
//     const a = Animated.loop(Animated.sequence([
//       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ]));
//     a.start();
//     return () => a.stop();
//   }, [sway]);
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

//   const setP = (list: Piece[]) => { piecesRef.current = list; setPieces(list); };
//   const cellXY = (c: number) => ({ x: (c % 3) * geo.current.cs, y: Math.floor(c / 3) * geo.current.cs });

//   // a new X or O on the board
//   const addPiece = (kind: number, cell: number) => {
//     const id = ++idRef.current;
//     posRef.current[id] = new Animated.ValueXY(cellXY(cell));
//     popRef.current[id] = new Animated.Value(0);
//     Animated.spring(popRef.current[id], { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
//     setP([...piecesRef.current, { id, kind, cell }]);
//   };

//   // draw a whole board without animation
//   const rebuild = (b: Board) => {
//     posRef.current = {}; popRef.current = {};
//     const list: Piece[] = [];
//     b.forEach((v, i) => {
//       if (!v) return;
//       const id = ++idRef.current;
//       posRef.current[id] = new Animated.ValueXY(cellXY(i));
//       popRef.current[id] = new Animated.Value(1);
//       list.push({ id, kind: v, cell: i });
//     });
//     setP(list);
//   };

//   // 1. open the level - the backend picks a start board every time
//   const load = useCallback(() => {
//     setLoadErr(''); setView(null);
//     startLevel10(playerId)
//       .then((v) => {
//         initialRef.current = v.board.slice();
//         boardRef.current = v.board.slice();
//         actionsRef.current = [];
//         busyRef.current = false;
//         doneRef.current = false;
//         setDone(false); setResult(null); setLine(null); setHintDir(null);
//         rebuild(v.board);
//         setSessionId(v.sessionId); sessionRef.current = v.sessionId;
//         setView(v);
//         if (setHints && typeof v.hints === 'number') setHints(v.hints);
//       })
//       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
//   }, [playerId]);                                  // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     load();
//     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
//   }, [load]);

//   // the screen size changed: put every piece on its square again
//   useEffect(() => {
//     piecesRef.current.forEach((p) => { const v = posRef.current[p.id]; if (v) v.setValue(cellXY(p.cell)); });
//   }, [cs]);                                        // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     const b = Animated.loop(Animated.sequence([
//       Animated.timing(bob, { toValue: 1, duration: 450, useNativeDriver: true }),
//       Animated.timing(bob, { toValue: 0, duration: 450, useNativeDriver: true }),
//     ]));
//     b.start();
//     return () => { b.stop(); };
//   }, []);

//   // level complete -> card pops in + sound
//   useEffect(() => {
//     if (result) {
//       play('correct');
//       Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
//     }
//   }, [result]);

//   // 2. X won: send what the player did, the backend plays it again and saves the win
//   const finish = async (attempt: number) => {
//     const sid = sessionRef.current;
//     if (!sid) return;
//     try {
//       const r = await finishLevel10({ sessionId: sid, playerId, actions: actionsRef.current.slice() });
//       if (setHints && typeof r.hints === 'number') setHints(r.hints);
//       setDone(true);
//       later(() => setResult(r), 1300);
//     } catch (e: any) {
//       if (attempt < 2) { later(() => finishRef.current(attempt + 1), 1200); return; }
//       doneRef.current = false;
//       flash(e.message || 'Network error. Try again.');
//       later(restart, 1600);
//     }
//   };
//   const finishRef = useRef(finish);
//   finishRef.current = finish;

//   // go back to the start board
//   const restart = () => {
//     boardRef.current = initialRef.current.slice();
//     actionsRef.current = [];
//     setLine(null); setHintDir(null);
//     rebuild(boardRef.current);
//     busyRef.current = false;
//   };

//   // what happens after a move
//   const settle = (s: Status) => {
//     if (s === 'play') { busyRef.current = false; return; }
//     if (s === 'win') {
//       doneRef.current = true;
//       setConfirmSkip(false);
//       setLine(winLine(boardRef.current, 1));
//       finishRef.current(0);
//       return;
//     }
//     play('wrong');
//     flash(s === 'lose' ? 'The rival wins! Try again...' : 'A draw is not a win! Try again...');
//     later(restart, 1700);
//   };

//   // tap a square: X goes there and the rival answers
//   const onTap = (c: number) => {
//     if (busyRef.current || doneRef.current) return;
//     const b = boardRef.current;
//     if (b[c] !== 0) { play('wrong'); flash('That square is taken!'); return; }
//     busyRef.current = true;
//     setHintDir(null);
//     play('tap');
//     actionsRef.current.push({ t: 'tap', c });
//     const r = playTap(b, c);
//     boardRef.current = r.board;
//     addPiece(1, c);
//     if (r.rival >= 0) later(() => addPiece(2, r.rival), 380);
//     later(() => settle(r.status), r.rival >= 0 ? 900 : 450);
//   };

//   // swipe the board: every piece slides to that side
//   const onSwipe = (d: Dir) => {
//     if (busyRef.current || doneRef.current) return;
//     const b = boardRef.current;
//     const moves = tiltMoves(b, d);
//     if (!moves.some((m) => m.from !== m.to)) { play('wrong'); flash('Nothing can slide that way'); return; }
//     busyRef.current = true;
//     setHintDir(null);
//     play('tap');
//     actionsRef.current.push({ t: 'swipe', d });
//     const nb = tilt(b, d);
//     boardRef.current = nb;

//     const to: Record<number, number> = {};
//     const anims: Animated.CompositeAnimation[] = [];
//     moves.forEach((m) => {
//       to[m.from] = m.to;
//       if (m.from === m.to) return;
//       const pc = piecesRef.current.find((p) => p.cell === m.from);
//       const v = pc && posRef.current[pc.id];
//       if (v) anims.push(Animated.timing(v, { toValue: cellXY(m.to), duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }));
//     });
//     Animated.parallel(anims).start(() => {
//       setP(piecesRef.current.map((p) => ({ ...p, cell: to[p.cell] !== undefined ? to[p.cell] : p.cell })));
//       settle(boardStatus(nb));
//     });
//   };

//   const onTapRef = useRef(onTap); onTapRef.current = onTap;
//   const onSwipeRef = useRef(onSwipe); onSwipeRef.current = onSwipe;
//   const gl = useRef({ x: 0, y: 0 });

//   // touch on the board: a short touch = tap a square, a drag = swipe the board
//   const pan = useRef(PanResponder.create({
//     onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
//     onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
//     onPanResponderTerminationRequest: () => false,
//     onPanResponderGrant: (e) => {
//       gl.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
//       setConfirmSkip(false);
//     },
//     onPanResponderRelease: (_e, g) => {
//       const dist = Math.hypot(g.dx, g.dy);
//       if (dist < 14) {
//         const q = geo.current;
//         const col = clamp(Math.floor(gl.current.x / q.cs), 0, 2), row = clamp(Math.floor(gl.current.y / q.cs), 0, 2);
//         onTapRef.current(row * 3 + col);
//       } else if (dist >= 26) {
//         const d: Dir = Math.abs(g.dx) > Math.abs(g.dy) ? (g.dx > 0 ? 'R' : 'L') : (g.dy > 0 ? 'D' : 'U');
//         onSwipeRef.current(d);
//       }
//     },
//   })).current;

//   // magnifier (search icon): frontend -> POST /hint -> backend saves it in the database -> JSON back -> popup opens
//   const onHint = async () => {
//     if (done || !sessionId) return;
//     setConfirmSkip(false);
//     try {
//       const r = await hintLevel10({ sessionId, playerId, board: boardRef.current });
//       if (typeof r.hints === 'number' && setHints) setHints(r.hints);
//       setClueText(r.clue || CLUE_1);
//       if (r.dir) {
//         setHintDir(r.dir);
//         later(() => setHintDir(null), 6000);
//       }
//       play('clue');
//       setClueOpen(true);
//     } catch (e: any) {
//       // backend refused (for example not enough hints) or network problem
//       play('wrong');
//       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
//     }
//   };

//   // video reward (+75 hints) - only adds hints, never opens the clue popup
//   const onReward = async () => {
//     if (done) return;
//     play('btn');
//     setConfirmSkip(false);
//     try {
//       const r = await rewardLevel10(playerId);
//       setHints && setHints(r.hints);
//       flash('+' + r.added + ' hints');
//     } catch (e: any) {
//       flash(e.message || 'Network error');
//     }
//   };

//   // skip (50 hints): tap twice
//   const onSkip = async () => {
//     if (done || !sessionId) return;
//     play('btn');
//     if (!confirmSkip) {
//       setConfirmSkip(true);
//       flash('Skip costs 50 hints. Tap again to skip.');
//       return;
//     }
//     try {
//       const r = await skipLevel10({ sessionId, playerId });
//       setHints && setHints(r.hints || 0);
//       doneRef.current = true;
//       onComplete ? onComplete(r) : onExit();
//     } catch (e: any) {
//       setConfirmSkip(false);
//       play('wrong');
//       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
//     }
//   };

//   /* ---------- header (same as Level 5 / Level 9) ---------- */
//   const header = (
//     <View style={st.topBar}>
//       <View style={st.leftBtns}>
//         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
//           <Icon n="home" s={20} />
//         </TouchableOpacity>
//         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
//           <Icon n="gear" s={21} />
//         </TouchableOpacity>
//       </View>

//       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
//         <Chain h={30} style={{ left: 24, top: -6 }} />
//         <Chain h={30} style={{ right: 24, top: -6 }} />
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 10</Text>
//           <Text style={st.signArrow}>{'>'}</Text>
//         </View>
//       </Animated.View>

//       <View style={st.pillWrap}>
//         <View style={st.pill}>
//           <Text style={st.pillT}>{hints}</Text>
//         </View>
//         <View style={st.pillIcon}>
//           <Icon n="bulb" s={34} />
//         </View>
//       </View>
//     </View>
//   );

//   /* ---------- loading / error ---------- */
//   if (loadErr || !view) {
//     return (
//       <Stage bg={SKY}>
//         <View style={st.root}>
//           <Garden />
//           {header}
//           <View style={st.centerMsg}>
//             {loadErr ? (
//               <>
//                 <Text style={st.err}>{loadErr}</Text>
//                 <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//                 <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
//               </>
//             ) : (
//               <>
//                 <ActivityIndicator size="large" color="#fff" />
//                 <Text style={st.load}>Loading level 10...</Text>
//               </>
//             )}
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   const bobX = bob.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] });
//   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'pointer' } : {};

//   return (
//     <Stage bg={SKY}>
//       <View style={st.root}>
//         <Garden />
//         {header}

//         <View style={st.center}>
//           {/* question pill */}
//           <View style={st.qPill}>
//             <Text style={st.qArrow}>{'<'}</Text>
//             <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
//             <Text style={st.qArrow}>{'>'}</Text>
//           </View>

//           {/* chalkboard: who is who + the tic-tac-toe board */}
//           <View style={st.chalk}>
//             <View style={st.legend}>
//               <View style={st.lg}><XMark s={34} /><Text style={st.lgt}>: YOU</Text></View>
//               <View style={st.lg}><OMark s={34} /><Text style={st.lgt}>: RIVAL</Text></View>
//             </View>

//             <View style={{ marginTop: 8, width: BS, height: BS }}>
//               <Grid size={BS} />

//               {pieces.map((p) => {
//                 const pos = posRef.current[p.id], pp = popRef.current[p.id];
//                 if (!pos || !pp) return null;
//                 return (
//                   <Animated.View key={p.id} pointerEvents="none"
//                     style={{
//                       position: 'absolute', left: 0, top: 0, width: cs, height: cs, alignItems: 'center', justifyContent: 'center',
//                       transform: [...pos.getTranslateTransform(), { scale: pp }],
//                     }}>
//                     {p.kind === 1 ? <XMark s={ms} /> : <OMark s={ms} />}
//                   </Animated.View>
//                 );
//               })}

//               {!!line && <View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line} /></View>}

//               {/* magnifier: which way to swipe */}
//               {!!hintDir && (
//                 <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
//                   <Animated.Text style={{
//                     fontSize: 76, color: '#ffd33d', opacity: 0.85, fontWeight: 'bold',
//                     transform: [{ rotate: ARROW_DEG[hintDir] }, { translateX: bobX }],
//                   }}>{'\u279C'}</Animated.Text>
//                 </View>
//               )}

//               <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
//             </View>
//           </View>
//         </View>

//         {/* bottom wooden panel (same as Level 5 / Level 9) */}
//         <View style={st.panel}>
//           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
//           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
//           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
//           <View style={[st.screw, { left: 16, top: 16 }]} />
//           <View style={[st.screw, { right: 16, top: 16 }]} />
//           <View style={[st.screw, { left: 16, bottom: 16 }]} />
//           <View style={[st.screw, { right: 16, bottom: 16 }]} />

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
//               <Icon n="search" s={40} />
//             </TouchableOpacity>
//             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>25</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
//               <Icon n="film" s={46} />
//             </TouchableOpacity>
//             <View style={st.badge}><Coin s={15} /><Text style={st.badgeT}>+75</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
//               <DoubleArrow s={42} />
//             </TouchableOpacity>
//             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>50</Text></View>
//           </View>
//         </View>

//         {/* CLUES popup (only from the magnifier / search icon) */}
//         {clueOpen && (
//           <View style={st.overlay}>
//             <View style={st.clueCard}>
//               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
//                 <Icon n="cross" s={20} />
//               </TouchableOpacity>
//               <Text style={st.clueTitle}>CLUES</Text>

//               <View style={[st.clueRow, st.clueRowOpen]}>
//                 <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={st.clueHead}>Clue 1</Text>
//                   <Text style={st.clueBody}>{clueText}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* result card */}
//         {!!result && (
//           <View style={st.overlay}>
//             <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
//               <Text style={st.cardTitle}>Level complete!</Text>
//               <Text style={st.cardMsg}>{result.message}</Text>
//               <View style={st.stars}>{[1, 2, 3].map((n) => <BigStar key={n} s={46} on={n <= (result.stars || 0)} />)}</View>
//               <Text style={st.cardScore}>Score {result.score}</Text>
//               <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
//                 <Text style={st.nextT}>NEXT</Text>
//               </TouchableOpacity>
//             </Animated.View>
//           </View>
//         )}
//       </View>
//     </Stage>
//   );
// }

// /* =========================================================
//    STYLES (same as Level 5 / Level 9)
// ========================================================= */

// const st = StyleSheet.create({
//   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

//   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
//   leftBtns: { flexDirection: 'row', gap: 8 },
//   woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
//   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
//   sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
//   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
//   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
//   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
//   pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
//   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
//   pillIcon: { position: 'absolute', right: -6, top: -4 },

//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 10, paddingBottom: 170 },
//   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
//   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 10, maxWidth: 380, elevation: 3 },
//   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
//   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

//   chalk: { backgroundColor: '#1f5b44', borderWidth: 6, borderColor: WOOD_D, borderRadius: 14, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 14, alignItems: 'center' },
//   legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 26 },
//   lg: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   lgt: { fontFamily: FONT, fontSize: 20, fontWeight: 'bold', color: CHALK },

//   // bottom wooden panel (solid wood, plank lines, corner rivets)
//   panel: {
//     position: 'absolute', left: 14, right: 14, bottom: 18, height: 148, borderRadius: 46,
//     backgroundColor: WOOD, borderWidth: 6, borderColor: WOOD_D,
//     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 20, elevation: 6,
//   },
//   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
//   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
//   btnCol: { alignItems: 'center' },
//   circleBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 7, alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8, minWidth: 76, paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: BADGE },
//   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

//   clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
//   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
//   closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
//   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
//   clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
//   clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
//   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
//   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
//   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

//   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
//   card: { width: '82%', alignItems: 'center', backgroundColor: CREAM, borderWidth: 8, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
//   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY },
//   cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
//   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
//   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#bd6b29', marginTop: 10 },
//   next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: '#8fe62d', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center' },
//   nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },

//   load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
//   err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
//   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
//   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
//   back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
// });
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Stage, F, Coin } from './BTShared';
import { Icon } from './Art';
import { BigStar } from './Btlevel5art';
import { Grid, XMark, OMark, StrikeLine } from './Btlevel10art';
import { startLevel10, hintLevel10, finishLevel10, skipLevel10, rewardLevel10, Level10View, Level10Result, Level10Action } from './Btlevel10api';
import { Board, Dir, Status, tap as playTap, tilt, tiltMoves, status as boardStatus, winLine } from './Btlevel10logic';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });
const CHALK = '#f6f4ea';

/* garden palette (same as Level 5 / Level 9) */
const NAVY = '#13235b';
const SKY = '#5cc0f5';
const CREAM = '#faf0e2';
const CREAM_BORDER = '#ead2a4';
const WOOD = '#eba24e';
const WOOD_D = '#c2782c';
const WOOD_DD = '#8f5a1f';
const LIME = '#a4e02a';
const LIME_RING = '#f4f1dc';
const RED = '#f0434d';
const ARROW = '#ffb629';
const BADGE = '#6b4423';
const GREEN_OK = '#3ec45a';
const YEL_BTN = '#fbc02d';
const YEL_BTN_D = '#d98e1c';

// clue shown in the CLUES popup when the magnifier (search icon) is tapped
const CLUE_1 = 'Your rival is one move away from victory… can you spot the place you need to protect?';

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level10Result) => void;
};

type Piece = { id: number; kind: number; cell: number };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ARROW_DEG: Record<Dir, string> = { R: '0deg', D: '90deg', L: '180deg', U: '270deg' };

/* ---------- garden background (same as Level 5 / Level 9) ---------- */
function Flower({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
      ))}
      <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
    </G>
  );
}

function Tuft({ x, y }: any) {
  return (
    <G transform={`translate(${x} ${y})`} fill="#4fb12c">
      <Polygon points="-14,0 -8,-34 -2,0" />
      <Polygon points="-4,0 4,-44 12,0" />
      <Polygon points="8,0 18,-30 24,0" />
    </G>
  );
}

function Cloud({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
      <Ellipse cx="0" cy="0" rx="70" ry="26" />
      <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
      <Ellipse cx="22" cy="-12" rx="30" ry="22" />
    </G>
  );
}

function Sprout({ x, y, s = 1 }: any) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <G fill="#5cb85c">
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
        <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
        <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
      </G>
      <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
      <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
      <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
      <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
      <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </G>
  );
}

function Garden() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* full-height sky */}
      <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="g10sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g10sky)" />
      </Svg>

      {/* trees + cloud, pinned to the top */}
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 330">
          <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
          <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
          <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
          <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
          <Cloud x={850} y={245} s={1} />
        </Svg>
      </View>

      {/* ground: hills, fence, bookshelf, sprout, meadow */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
        <Svg width="100%" height="100%" viewBox="0 0 942 1269">
          <Cloud x={50} y={585} s={0.9} />
          <Cloud x={880} y={600} s={0.6} />

          <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
          <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
          <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const x = -10 + i * 90;
            return (
              <G key={i}>
                <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
                <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
              </G>
            );
          })}
          <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
          <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

          <G>
            <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
            <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
            <G fill="#4cb04a">
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
              <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
              <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
            </G>
            <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
            <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
            <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
            <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
            <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
            <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
            <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
            <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
            <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
            <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
            <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
            <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
          </G>

          <Sprout x={10} y={740} s={1} />

          <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
          <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

          <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
          <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
          <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

          <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
          <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
          <Flower x="885" y="815" s={0.8} />
          <Flower x="200" y="1225" s={0.95} />
          <Flower x="735" y="1225" s={0.95} />
        </Svg>
      </View>
    </View>
  );
}

/* ---------- thin link chain for the hanging sign ---------- */
function Chain({ h = 28, style }: { h?: number; style?: any }) {
  const n = Math.max(2, Math.round(h / 8));
  return (
    <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
      {Array.from({ length: n }).map((_, i) => (
        <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
      ))}
    </Svg>
  );
}

/* ---------- double arrow (skip icon) ---------- */
function DoubleArrow({ s }: { s: number }) {
  return (
    <Svg width={s} height={s} viewBox="0 0 100 100">
      <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
      <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
    </Svg>
  );
}

/* =========================================================
   SCREEN
========================================================= */

export default function BTLevel10Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const RW = Math.min(width - 24, 360);
  const BS = Math.floor(clamp(Math.min(RW - 60, height - 420), 170, 280));   // the tic-tac-toe board in pixels
  const cs = BS / 3;                               // one square
  const ms = cs * 0.8;                             // size of an X or an O

  const [view, setView] = useState<Level10View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [line, setLine] = useState<number[] | null>(null);
  const [hintDir, setHintDir] = useState<Dir | null>(null);
  const [result, setResult] = useState<Level10Result | null>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);
  const [clueText, setClueText] = useState(CLUE_1);   // clue text comes from the backend response

  const pop = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const geo = useRef({ cs });
  geo.current = { cs };
  const boardRef = useRef<Board>([0, 0, 0, 0, 0, 0, 0, 0, 0]);     // the board as it is now
  const initialRef = useRef<Board>([0, 0, 0, 0, 0, 0, 0, 0, 0]);   // the start board (restart goes back here)
  const actionsRef = useRef<Level10Action[]>([]);                  // what the player did since the last restart
  const piecesRef = useRef<Piece[]>([]);
  const idRef = useRef(0);
  const posRef = useRef<Record<number, Animated.ValueXY>>({});
  const popRef = useRef<Record<number, Animated.Value>>({});
  const busyRef = useRef(false);
  const doneRef = useRef(false);
  const sessionRef = useRef<number | null>(null);
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const later = (fn: () => void, ms2: number) => { timers.current.push(setTimeout(fn, ms2)); };

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2800);
  };

  // hanging sign sways gently (same as Level 5 / Level 9)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  const setP = (list: Piece[]) => { piecesRef.current = list; setPieces(list); };
  const cellXY = (c: number) => ({ x: (c % 3) * geo.current.cs, y: Math.floor(c / 3) * geo.current.cs });

  // a new X or O on the board
  const addPiece = (kind: number, cell: number) => {
    const id = ++idRef.current;
    posRef.current[id] = new Animated.ValueXY(cellXY(cell));
    popRef.current[id] = new Animated.Value(0);
    Animated.spring(popRef.current[id], { toValue: 1, friction: 4, tension: 90, useNativeDriver: true }).start();
    setP([...piecesRef.current, { id, kind, cell }]);
  };

  // draw a whole board without animation
  const rebuild = (b: Board) => {
    posRef.current = {}; popRef.current = {};
    const list: Piece[] = [];
    b.forEach((v, i) => {
      if (!v) return;
      const id = ++idRef.current;
      posRef.current[id] = new Animated.ValueXY(cellXY(i));
      popRef.current[id] = new Animated.Value(1);
      list.push({ id, kind: v, cell: i });
    });
    setP(list);
  };

  // 1. open the level - the backend picks a start board every time
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel10(playerId)
      .then((v) => {
        initialRef.current = v.board.slice();
        boardRef.current = v.board.slice();
        actionsRef.current = [];
        busyRef.current = false;
        doneRef.current = false;
        setDone(false); setResult(null); setLine(null); setHintDir(null);
        rebuild(v.board);
        setSessionId(v.sessionId); sessionRef.current = v.sessionId;
        setView(v);
        if (setHints && typeof v.hints === 'number') setHints(v.hints);
      })
      .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
  }, [playerId]);                                  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
    return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
  }, [load]);

  // the screen size changed: put every piece on its square again
  useEffect(() => {
    piecesRef.current.forEach((p) => { const v = posRef.current[p.id]; if (v) v.setValue(cellXY(p.cell)); });
  }, [cs]);                                        // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const b = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]));
    b.start();
    return () => { b.stop(); };
  }, []);

  // level complete -> card pops in + sound
  useEffect(() => {
    if (result) {
      play('correct');
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
    }
  }, [result]);

  // 2. X won: send what the player did, the backend plays it again and saves the win
  const finish = async (attempt: number) => {
    const sid = sessionRef.current;
    if (!sid) return;
    try {
      const r = await finishLevel10({ sessionId: sid, playerId, actions: actionsRef.current.slice() });
      if (setHints && typeof r.hints === 'number') setHints(r.hints);
      setDone(true);
      later(() => setResult(r), 1300);
    } catch (e: any) {
      if (attempt < 2) { later(() => finishRef.current(attempt + 1), 1200); return; }
      doneRef.current = false;
      flash(e.message || 'Network error. Try again.');
      later(restart, 1600);
    }
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  // go back to the start board
  const restart = () => {
    boardRef.current = initialRef.current.slice();
    actionsRef.current = [];
    setLine(null); setHintDir(null);
    rebuild(boardRef.current);
    busyRef.current = false;
  };

  // what happens after a move
  const settle = (s: Status) => {
    if (s === 'play') { busyRef.current = false; return; }
    if (s === 'win') {
      doneRef.current = true;
      setConfirmSkip(false);
      setLine(winLine(boardRef.current, 1));
      finishRef.current(0);
      return;
    }
    play('wrong');
    flash(s === 'lose' ? 'The rival wins! Try again...' : 'A draw is not a win! Try again...');
    later(restart, 1700);
  };

  // tap a square: X goes there and the rival answers
  const onTap = (c: number) => {
    if (busyRef.current || doneRef.current) return;
    const b = boardRef.current;
    if (b[c] !== 0) { play('wrong'); flash('That square is taken!'); return; }
    busyRef.current = true;
    setHintDir(null);
    play('tap');
    actionsRef.current.push({ t: 'tap', c });
    const r = playTap(b, c);
    boardRef.current = r.board;
    addPiece(1, c);
    if (r.rival >= 0) later(() => addPiece(2, r.rival), 380);
    later(() => settle(r.status), r.rival >= 0 ? 900 : 450);
  };

  // swipe the board: every piece slides to that side
  const onSwipe = (d: Dir) => {
    if (busyRef.current || doneRef.current) return;
    const b = boardRef.current;
    const moves = tiltMoves(b, d);
    if (!moves.some((m) => m.from !== m.to)) { play('wrong'); flash('Nothing can slide that way'); return; }
    busyRef.current = true;
    setHintDir(null);
    play('tap');
    actionsRef.current.push({ t: 'swipe', d });
    const nb = tilt(b, d);
    boardRef.current = nb;

    const to: Record<number, number> = {};
    const anims: Animated.CompositeAnimation[] = [];
    moves.forEach((m) => {
      to[m.from] = m.to;
      if (m.from === m.to) return;
      const pc = piecesRef.current.find((p) => p.cell === m.from);
      const v = pc && posRef.current[pc.id];
      if (v) anims.push(Animated.timing(v, { toValue: cellXY(m.to), duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }));
    });
    Animated.parallel(anims).start(() => {
      setP(piecesRef.current.map((p) => ({ ...p, cell: to[p.cell] !== undefined ? to[p.cell] : p.cell })));
      settle(boardStatus(nb));
    });
  };

  const onTapRef = useRef(onTap); onTapRef.current = onTap;
  const onSwipeRef = useRef(onSwipe); onSwipeRef.current = onSwipe;
  const gl = useRef({ x: 0, y: 0 });

  // touch on the board: a short touch = tap a square, a drag = swipe the board
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
    onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (e) => {
      gl.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
      setConfirmSkip(false);
    },
    onPanResponderRelease: (_e, g) => {
      const dist = Math.hypot(g.dx, g.dy);
      if (dist < 14) {
        const q = geo.current;
        const col = clamp(Math.floor(gl.current.x / q.cs), 0, 2), row = clamp(Math.floor(gl.current.y / q.cs), 0, 2);
        onTapRef.current(row * 3 + col);
      } else if (dist >= 26) {
        const d: Dir = Math.abs(g.dx) > Math.abs(g.dy) ? (g.dx > 0 ? 'R' : 'L') : (g.dy > 0 ? 'D' : 'U');
        onSwipeRef.current(d);
      }
    },
  })).current;

  // magnifier (search icon): frontend -> POST /hint -> backend saves it in the database -> JSON back -> popup opens
  const onHint = async () => {
    if (done || !sessionId) return;
    setConfirmSkip(false);
    try {
      const r = await hintLevel10({ sessionId, playerId, board: boardRef.current });
      if (typeof r.hints === 'number' && setHints) setHints(r.hints);
      setClueText(r.clue || CLUE_1);
      if (r.dir) {
        setHintDir(r.dir);
        later(() => setHintDir(null), 6000);
      }
      play('clue');
      setClueOpen(true);
    } catch (e: any) {
      // backend refused (for example not enough hints) or network problem
      play('wrong');
      flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
    }
  };

  // video reward (+75 hints) - only adds hints, never opens the clue popup
  const onReward = async () => {
    if (done) return;
    play('btn');
    setConfirmSkip(false);
    try {
      const r = await rewardLevel10(playerId);
      setHints && setHints(r.hints);
      flash('+' + r.added + ' hints');
    } catch (e: any) {
      flash(e.message || 'Network error');
    }
  };

  // skip (50 hints): tap twice
  const onSkip = async () => {
    if (done || !sessionId) return;
    play('btn');
    if (!confirmSkip) {
      setConfirmSkip(true);
      flash('Skip costs 50 hints. Tap again to skip.');
      return;
    }
    try {
      const r = await skipLevel10({ sessionId, playerId });
      setHints && setHints(r.hints || 0);
      doneRef.current = true;
      onComplete ? onComplete(r) : onExit();
    } catch (e: any) {
      setConfirmSkip(false);
      play('wrong');
      flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
    }
  };

  /* ---------- header (same as Level 5 / Level 9) ---------- */
  const header = (
    <View style={st.topBar}>
      <View style={st.leftBtns}>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
          <Icon n="home" s={20} />
        </TouchableOpacity>
        <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
          <Icon n="gear" s={21} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
        <Chain h={30} style={{ left: 24, top: -6 }} />
        <Chain h={30} style={{ right: 24, top: -6 }} />
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 10</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
      </Animated.View>

      <View style={st.pillWrap}>
        <View style={st.pill}>
          <Text style={st.pillT}>{hints}</Text>
        </View>
        <View style={st.pillIcon}>
          <Icon n="bulb" s={34} />
        </View>
      </View>
    </View>
  );

  /* ---------- loading / error ---------- */
  if (loadErr || !view) {
    return (
      <Stage bg={SKY}>
        <View style={st.root}>
          <Garden />
          {header}
          <View style={st.centerMsg}>
            {loadErr ? (
              <>
                <Text style={st.err}>{loadErr}</Text>
                <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={st.load}>Loading level 10...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const bobX = bob.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] });
  const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'pointer' } : {};

  return (
    <Stage bg={SKY}>
      <View style={st.root}>
        <Garden />
        {header}

        <View style={st.center}>
          {/* question pill */}
          <View style={st.qPill}>
            <Text style={st.qArrow}>{'<'}</Text>
            <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
            <Text style={st.qArrow}>{'>'}</Text>
          </View>

          {/* chalkboard: who is who + the tic-tac-toe board */}
          <View style={st.chalk}>
            <View style={st.legend}>
              <View style={st.lg}><XMark s={34} /><Text style={st.lgt}>: YOU</Text></View>
              <View style={st.lg}><OMark s={34} /><Text style={st.lgt}>: RIVAL</Text></View>
            </View>

            <View style={{ marginTop: 8, width: BS, height: BS }}>
              <Grid size={BS} />

              {pieces.map((p) => {
                const pos = posRef.current[p.id], pp = popRef.current[p.id];
                if (!pos || !pp) return null;
                return (
                  <Animated.View key={p.id} pointerEvents="none"
                    style={{
                      position: 'absolute', left: 0, top: 0, width: cs, height: cs, alignItems: 'center', justifyContent: 'center',
                      transform: [...pos.getTranslateTransform(), { scale: pp }],
                    }}>
                    {p.kind === 1 ? <XMark s={ms} /> : <OMark s={ms} />}
                  </Animated.View>
                );
              })}

              {!!line && <View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line} /></View>}

              {/* magnifier: which way to swipe */}
              {!!hintDir && (
                <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                  <Animated.Text style={{
                    fontSize: 76, color: '#ffd33d', opacity: 0.85, fontWeight: 'bold',
                    transform: [{ rotate: ARROW_DEG[hintDir] }, { translateX: bobX }],
                  }}>{'\u279C'}</Animated.Text>
                </View>
              )}

              <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
            </View>
          </View>
        </View>

        {/* bottom wooden panel - small, like Level 5 */}
        <View style={st.panel}>
          <View style={[st.plank, { top: 14, left: 30, right: 30 }]} />
          <View style={[st.plank, { top: 62, left: 24, right: 24 }]} />
          <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
          <View style={[st.screw, { left: 14, top: 14 }]} />
          <View style={[st.screw, { right: 14, top: 14 }]} />
          <View style={[st.screw, { left: 14, bottom: 12 }]} />
          <View style={[st.screw, { right: 14, bottom: 12 }]} />

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
              <Icon n="search" s={32} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={16} /><Text style={st.badgeT}>25</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
              <Icon n="film" s={38} />
            </TouchableOpacity>
            <View style={st.badge}><Coin s={13} /><Text style={st.badgeT}>+75</Text></View>
          </View>

          <View style={st.btnCol}>
            <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
              <DoubleArrow s={34} />
            </TouchableOpacity>
            <View style={st.badge}><Icon n="bulb" s={16} /><Text style={st.badgeT}>50</Text></View>
          </View>
        </View>

        {/* CLUES popup (only from the magnifier / search icon) */}
        {clueOpen && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
                <Icon n="cross" s={20} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Hint 1</Text>
                  <Text style={st.clueBody}>{clueText}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* result card */}
        {!!result && (
          <View style={st.overlay}>
            <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
              <Text style={st.cardTitle}>Level complete!</Text>
              <Text style={st.cardMsg}>{result.message}</Text>
              <View style={st.stars}>{[1, 2, 3].map((n) => <BigStar key={n} s={46} on={n <= (result.stars || 0)} />)}</View>
              <Text style={st.cardScore}>Score {result.score}</Text>
              <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
                <Text style={st.nextT}>NEXT</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </Stage>
  );
}

/* =========================================================
   STYLES (same as Level 5 / Level 9)
========================================================= */

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
  leftBtns: { flexDirection: 'row', gap: 8 },
  woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
  signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
  pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
  pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
  pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
  pillIcon: { position: 'absolute', right: -6, top: -4 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 10, paddingBottom: 140 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 10, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },

  chalk: { backgroundColor: '#1f5b44', borderWidth: 6, borderColor: WOOD_D, borderRadius: 14, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 14, alignItems: 'center' },
  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 26 },
  lg: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lgt: { fontFamily: FONT, fontSize: 20, fontWeight: 'bold', color: CHALK },

  // bottom wooden panel - small like Level 5 (solid wood, plank lines, corner rivets)
  panel: {
    position: 'absolute', left: 22, right: 22, bottom: 16, height: 116, borderRadius: 36,
    backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 14, elevation: 6,
  },
  plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
  screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
  btnCol: { alignItems: 'center' },
  circleBtn: { width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 6, minWidth: 64, paddingHorizontal: 10, height: 26, borderRadius: 13, backgroundColor: BADGE },
  badgeT: { fontFamily: FONT, fontSize: 15, fontWeight: '900', color: '#fff' },

  clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
  closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
  clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  card: { width: '82%', alignItems: 'center', backgroundColor: CREAM, borderWidth: 8, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
  cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY },
  cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
  stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
  cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#bd6b29', marginTop: 10 },
  next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: '#8fe62d', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center' },
  nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },

  load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
  err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
  retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
  back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
});
