// // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,TouchableOpacity,Animated,Easing,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // // // import {F,INK,Coin} from './BTShared';
// // // // // import {Icon} from './Art';
// // // // // import {BigStar,Duster,ChalkPiece} from './Btlevel7art';
// // // // // import {Grid,XMark,OMark,StrikeLine} from './Btlevel10art';
// // // // // import {startLevel10,hintLevel10,finishLevel10,skipLevel10,rewardLevel10,Level10View,Level10Result,Level10Action} from './Btlevel10api';
// // // // // import {Board,Dir,Status,tap as playTap,tilt,tiltMoves,status as boardStatus,winLine} from './Btlevel10logic';

// // // // // const CHALK='#f6f4ea';

// // // // // type Props={
// // // // //   playerId:number;
// // // // //   hints?:number;
// // // // //   setHints?:(n:number)=>void;
// // // // //   onExit:()=>void;
// // // // //   onComplete?:(result:Level10Result)=>void;
// // // // // };

// // // // // type Piece={id:number;kind:number;cell:number};

// // // // // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// // // // // const ARROW_DEG:Record<Dir,string>={R:'0deg',D:'90deg',L:'180deg',U:'270deg'};

// // // // // export default function BTLevel10Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // // //   const {width,height}=useWindowDimensions();
// // // // //   const RW=Math.min(width-36,340);                 // frame width
// // // // //   const IW=RW-6;
// // // // //   const BS=Math.floor(clamp(Math.min(IW-24,height-470),180,280));   // the tic-tac-toe board in pixels
// // // // //   const cs=BS/3;                                   // one square
// // // // //   const ms=cs*0.8;                                 // size of an X or an O

// // // // //   const [view,setView]=useState<Level10View|null>(null);
// // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // //   const [loadErr,setLoadErr]=useState('');
// // // // //   const [msg,setMsg]=useState('');
// // // // //   const [done,setDone]=useState(false);
// // // // //   const [pieces,setPieces]=useState<Piece[]>([]);
// // // // //   const [line,setLine]=useState<number[]|null>(null);
// // // // //   const [hintDir,setHintDir]=useState<Dir|null>(null);
// // // // //   const [result,setResult]=useState<Level10Result|null>(null);
// // // // //   const [confirmSkip,setConfirmSkip]=useState(false);

// // // // //   const pop=useRef(new Animated.Value(0)).current;
// // // // //   const sway=useRef(new Animated.Value(0)).current;
// // // // //   const bob=useRef(new Animated.Value(0)).current;

// // // // //   const geo=useRef({cs});
// // // // //   geo.current={cs};
// // // // //   const boardRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);     // the board as it is now
// // // // //   const initialRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);   // the start board (restart goes back here)
// // // // //   const actionsRef=useRef<Level10Action[]>([]);          // what the player did since the last restart
// // // // //   const piecesRef=useRef<Piece[]>([]);
// // // // //   const idRef=useRef(0);
// // // // //   const posRef=useRef<Record<number,Animated.ValueXY>>({});
// // // // //   const popRef=useRef<Record<number,Animated.Value>>({});
// // // // //   const busyRef=useRef(false);
// // // // //   const doneRef=useRef(false);
// // // // //   const sessionRef=useRef<number|null>(null);
// // // // //   const timers=useRef<any[]>([]);
// // // // //   const msgTimer=useRef<any>(null);
// // // // //   const later=(fn:()=>void,ms2:number)=>{timers.current.push(setTimeout(fn,ms2))};

// // // // //   const flash=(m:string)=>{
// // // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // // //   };

// // // // //   const setP=(list:Piece[])=>{piecesRef.current=list;setPieces(list)};
// // // // //   const cellXY=(c:number)=>({x:(c%3)*geo.current.cs,y:Math.floor(c/3)*geo.current.cs});

// // // // //   // a new X or O on the board
// // // // //   const addPiece=(kind:number,cell:number)=>{
// // // // //     const id=++idRef.current;
// // // // //     posRef.current[id]=new Animated.ValueXY(cellXY(cell));
// // // // //     popRef.current[id]=new Animated.Value(0);
// // // // //     Animated.spring(popRef.current[id],{toValue:1,friction:4,tension:90,useNativeDriver:true}).start();
// // // // //     setP([...piecesRef.current,{id,kind,cell}]);
// // // // //   };

// // // // //   // draw a whole board without animation
// // // // //   const rebuild=(b:Board)=>{
// // // // //     posRef.current={};popRef.current={};
// // // // //     const list:Piece[]=[];
// // // // //     b.forEach((v,i)=>{
// // // // //       if(!v)return;
// // // // //       const id=++idRef.current;
// // // // //       posRef.current[id]=new Animated.ValueXY(cellXY(i));
// // // // //       popRef.current[id]=new Animated.Value(1);
// // // // //       list.push({id,kind:v,cell:i});
// // // // //     });
// // // // //     setP(list);
// // // // //   };

// // // // //   // 1. open the level - the backend picks a start board every time
// // // // //   const load=useCallback(()=>{
// // // // //     setLoadErr('');setView(null);
// // // // //     startLevel10(playerId)
// // // // //       .then(v=>{
// // // // //         initialRef.current=v.board.slice();
// // // // //         boardRef.current=v.board.slice();
// // // // //         actionsRef.current=[];
// // // // //         busyRef.current=false;
// // // // //         doneRef.current=false;
// // // // //         setDone(false);setResult(null);setLine(null);setHintDir(null);
// // // // //         rebuild(v.board);
// // // // //         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
// // // // //         setView(v);
// // // // //         if(setHints&&typeof v.hints==='number')setHints(v.hints);
// // // // //       })
// // // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // // //   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

// // // // //   useEffect(()=>{
// // // // //     load();
// // // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // // //   },[load]);

// // // // //   // the screen size changed: put every piece on its square again
// // // // //   useEffect(()=>{
// // // // //     piecesRef.current.forEach(p=>{const v=posRef.current[p.id];if(v)v.setValue(cellXY(p.cell))});
// // // // //   },[cs]);                                         // eslint-disable-line react-hooks/exhaustive-deps

// // // // //   useEffect(()=>{
// // // // //     const l=Animated.loop(Animated.sequence([
// // // // //       Animated.timing(sway,{toValue:1,duration:1800,useNativeDriver:true}),
// // // // //       Animated.timing(sway,{toValue:0,duration:1800,useNativeDriver:true})]));
// // // // //     l.start();
// // // // //     const b=Animated.loop(Animated.sequence([
// // // // //       Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
// // // // //       Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
// // // // //     b.start();
// // // // //     return()=>{l.stop();b.stop()};
// // // // //   },[]);

// // // // //   useEffect(()=>{
// // // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // // //   },[result]);

// // // // //   // 2. X won: send what the player did, the backend plays it again and saves the win
// // // // //   const finish=async(attempt:number)=>{
// // // // //     const sid=sessionRef.current;
// // // // //     if(!sid)return;
// // // // //     try{
// // // // //       const r=await finishLevel10({sessionId:sid,playerId,actions:actionsRef.current.slice()});
// // // // //       if(setHints&&typeof r.hints==='number')setHints(r.hints);
// // // // //       setDone(true);
// // // // //       later(()=>setResult(r),1300);
// // // // //     }catch(e:any){
// // // // //       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
// // // // //       doneRef.current=false;
// // // // //       flash(e.message||'Network error. Try again.');
// // // // //       later(restart,1600);
// // // // //     }
// // // // //   };
// // // // //   const finishRef=useRef(finish);
// // // // //   finishRef.current=finish;

// // // // //   // go back to the start board
// // // // //   const restart=()=>{
// // // // //     boardRef.current=initialRef.current.slice();
// // // // //     actionsRef.current=[];
// // // // //     setLine(null);setHintDir(null);
// // // // //     rebuild(boardRef.current);
// // // // //     busyRef.current=false;
// // // // //   };

// // // // //   // what happens after a move
// // // // //   const settle=(s:Status)=>{
// // // // //     if(s==='play'){busyRef.current=false;return}
// // // // //     if(s==='win'){
// // // // //       doneRef.current=true;
// // // // //       setConfirmSkip(false);
// // // // //       setLine(winLine(boardRef.current,1));
// // // // //       finishRef.current(0);
// // // // //       return;
// // // // //     }
// // // // //     flash(s==='lose'?'The rival wins! Try again...':'A draw is not a win! Try again...');
// // // // //     later(restart,1700);
// // // // //   };

// // // // //   // tap a square: X goes there and the rival answers
// // // // //   const onTap=(c:number)=>{
// // // // //     if(busyRef.current||doneRef.current)return;
// // // // //     const b=boardRef.current;
// // // // //     if(b[c]!==0){flash('That square is taken!');return}
// // // // //     busyRef.current=true;
// // // // //     setHintDir(null);
// // // // //     actionsRef.current.push({t:'tap',c});
// // // // //     const r=playTap(b,c);
// // // // //     boardRef.current=r.board;
// // // // //     addPiece(1,c);
// // // // //     if(r.rival>=0)later(()=>addPiece(2,r.rival),380);
// // // // //     later(()=>settle(r.status),r.rival>=0?900:450);
// // // // //   };

// // // // //   // swipe the board: every piece slides to that side
// // // // //   const onSwipe=(d:Dir)=>{
// // // // //     if(busyRef.current||doneRef.current)return;
// // // // //     const b=boardRef.current;
// // // // //     const moves=tiltMoves(b,d);
// // // // //     if(!moves.some(m=>m.from!==m.to)){flash('Nothing can slide that way');return}
// // // // //     busyRef.current=true;
// // // // //     setHintDir(null);
// // // // //     actionsRef.current.push({t:'swipe',d});
// // // // //     const nb=tilt(b,d);
// // // // //     boardRef.current=nb;

// // // // //     const to:Record<number,number>={};
// // // // //     const anims:Animated.CompositeAnimation[]=[];
// // // // //     moves.forEach(m=>{
// // // // //       to[m.from]=m.to;
// // // // //       if(m.from===m.to)return;
// // // // //       const pc=piecesRef.current.find(p=>p.cell===m.from);
// // // // //       const v=pc&&posRef.current[pc.id];
// // // // //       if(v)anims.push(Animated.timing(v,{toValue:cellXY(m.to),duration:340,easing:Easing.out(Easing.cubic),useNativeDriver:true}));
// // // // //     });
// // // // //     Animated.parallel(anims).start(()=>{
// // // // //       setP(piecesRef.current.map(p=>({...p,cell:to[p.cell]!==undefined?to[p.cell]:p.cell})));
// // // // //       settle(boardStatus(nb));
// // // // //     });
// // // // //   };

// // // // //   const onTapRef=useRef(onTap);onTapRef.current=onTap;
// // // // //   const onSwipeRef=useRef(onSwipe);onSwipeRef.current=onSwipe;
// // // // //   const gl=useRef({x:0,y:0});

// // // // //   // touch on the board: a short touch = tap a square, a drag = swipe the board
// // // // //   const pan=useRef(PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // // //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // // //     onPanResponderTerminationRequest:()=>false,
// // // // //     onPanResponderGrant:(e)=>{
// // // // //       gl.current={x:e.nativeEvent.locationX,y:e.nativeEvent.locationY};
// // // // //       setConfirmSkip(false);
// // // // //     },
// // // // //     onPanResponderRelease:(_e,g)=>{
// // // // //       const dist=Math.hypot(g.dx,g.dy);
// // // // //       if(dist<14){
// // // // //         const q=geo.current;
// // // // //         const col=clamp(Math.floor(gl.current.x/q.cs),0,2),row=clamp(Math.floor(gl.current.y/q.cs),0,2);
// // // // //         onTapRef.current(row*3+col);
// // // // //       }else if(dist>=26){
// // // // //         const d:Dir=Math.abs(g.dx)>Math.abs(g.dy)?(g.dx>0?'R':'L'):(g.dy>0?'D':'U');
// // // // //         onSwipeRef.current(d);
// // // // //       }
// // // // //     },
// // // // //   })).current;

// // // // //   // magnifier: the server tells which way to swipe (25 hints)
// // // // //   const onHint=async()=>{
// // // // //     if(done||!sessionId)return;
// // // // //     setConfirmSkip(false);
// // // // //     try{
// // // // //       const r=await hintLevel10({sessionId,playerId,board:boardRef.current});
// // // // //       setHints&&setHints(r.hints);
// // // // //       setHintDir(r.dir);
// // // // //       later(()=>setHintDir(null),6000);
// // // // //     }catch(e:any){
// // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // //     }
// // // // //   };

// // // // //   // video reward (+75 hints)
// // // // //   const onReward=async()=>{
// // // // //     if(done)return;
// // // // //     setConfirmSkip(false);
// // // // //     try{
// // // // //       const r=await rewardLevel10(playerId);
// // // // //       setHints&&setHints(r.hints);
// // // // //       flash('+'+r.added+' hints');
// // // // //     }catch(e:any){
// // // // //       flash(e.message||'Network error');
// // // // //     }
// // // // //   };

// // // // //   // skip (50 hints): tap twice
// // // // //   const onSkip=async()=>{
// // // // //     if(done||!sessionId)return;
// // // // //     if(!confirmSkip){
// // // // //       setConfirmSkip(true);
// // // // //       flash('Skip costs 50 hints. Tap again to skip.');
// // // // //       return;
// // // // //     }
// // // // //     try{
// // // // //       const r=await skipLevel10({sessionId,playerId});
// // // // //       setHints&&setHints(r.hints||0);
// // // // //       doneRef.current=true;
// // // // //       onComplete?onComplete(r):onExit();
// // // // //     }catch(e:any){
// // // // //       setConfirmSkip(false);
// // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // //     }
// // // // //   };

// // // // //   /* ---------- loading / error ---------- */

// // // // //   if(loadErr||!view){
// // // // //     return <View style={bd.wall}><View style={bd.frame}><View style={[bd.board,{justifyContent:'center'}]}>
// // // // //       {loadErr?<>
// // // // //         <Text style={bd.err}>{loadErr}</Text>
// // // // //         <TouchableOpacity style={bd.retry} onPress={load}><Text style={bd.retryT}>Try again</Text></TouchableOpacity>
// // // // //         <TouchableOpacity onPress={onExit}><Text style={bd.back}>Back</Text></TouchableOpacity>
// // // // //       </>:<>
// // // // //         <ActivityIndicator size="large" color={CHALK}/>
// // // // //         <Text style={bd.load}>Loading level 10...</Text>
// // // // //       </>}
// // // // //     </View></View></View>;
// // // // //   }

// // // // //   const swayR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']});
// // // // //   const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
// // // // //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

// // // // //   return <View style={bd.wall}>
// // // // //     <View style={bd.frame}><View style={bd.board}>
// // // // //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// // // // //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// // // // //       <View pointerEvents="none" style={bd.sheen}/>

// // // // //       {/* top bar */}
// // // // //       <View style={bd.top}>
// // // // //         <View style={bd.topL}>
// // // // //           <TouchableOpacity style={bd.round} onPress={onExit}><Icon n="home" s={16}/></TouchableOpacity>
// // // // //           <View style={bd.round}><Icon n="gear" s={16}/></View>
// // // // //         </View>
// // // // //         <Animated.View style={[bd.signWrap,{transform:[{rotate:swayR}]}]}>
// // // // //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // // // //           <View style={bd.sign}>
// // // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // // // //             <Text style={bd.signt}>LEVEL 10</Text>
// // // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // // // //           </View>
// // // // //         </Animated.View>
// // // // //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // // // //       </View>

// // // // //       <Text style={[bd.q,msg?{color:'#ffb4a8'}:null]}>{msg||view.title}</Text>

// // // // //       {/* who is who */}
// // // // //       <View style={bd.legend}>
// // // // //         <View style={bd.lg}><XMark s={38}/><Text style={bd.lgt}>: YOU</Text></View>
// // // // //         <View style={bd.lg}><OMark s={38}/><Text style={bd.lgt}>: RIVAL</Text></View>
// // // // //       </View>

// // // // //       {/* the tic-tac-toe board */}
// // // // //       <View style={{marginTop:12,width:BS,height:BS}}>
// // // // //         <Grid size={BS}/>

// // // // //         {pieces.map(p=>{
// // // // //           const pos=posRef.current[p.id],pp=popRef.current[p.id];
// // // // //           if(!pos||!pp)return null;
// // // // //           return <Animated.View key={p.id} pointerEvents="none"
// // // // //             style={{position:'absolute',left:0,top:0,width:cs,height:cs,alignItems:'center',justifyContent:'center',
// // // // //               transform:[...pos.getTranslateTransform(),{scale:pp}]}}>
// // // // //             {p.kind===1?<XMark s={ms}/>:<OMark s={ms}/>}
// // // // //           </Animated.View>;
// // // // //         })}

// // // // //         {!!line&&<View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line}/></View>}

// // // // //         {/* magnifier: which way to swipe */}
// // // // //         {!!hintDir&&<View pointerEvents="none" style={[StyleSheet.absoluteFill,{alignItems:'center',justifyContent:'center'}]}>
// // // // //           <Animated.Text style={{fontSize:76,color:'#ffd33d',opacity:0.85,fontWeight:'bold',
// // // // //             transform:[{rotate:ARROW_DEG[hintDir]},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>
// // // // //         </View>}

// // // // //         <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// // // // //       </View>

// // // // //       {/* hint / video / skip */}
// // // // //       <View style={bd.actions}>
// // // // //         <View style={bd.acol}>
// // // // //           <TouchableOpacity style={bd.hintBtn} onPress={onHint}><Icon n="search" s={34}/></TouchableOpacity>
// // // // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>25</Text></View>
// // // // //         </View>
// // // // //         <View style={bd.acol}>
// // // // //           <TouchableOpacity style={bd.videoBtn} onPress={onReward}><Icon n="film" s={40}/></TouchableOpacity>
// // // // //           <View style={bd.lblRow}><Coin s={12}/><Text style={bd.lbl}>+75</Text></View>
// // // // //         </View>
// // // // //         <View style={bd.acol}>
// // // // //           <TouchableOpacity style={bd.skipBtn} onPress={onSkip}><Icon n="play" s={36}/></TouchableOpacity>
// // // // //           <View style={bd.lblRow}><Icon n="bulb" s={14}/><Text style={bd.lbl}>50</Text></View>
// // // // //         </View>
// // // // //       </View>

// // // // //       {/* chalk tray */}
// // // // //       <View style={bd.ledge}>
// // // // //         {[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:6+i*6,height:1,backgroundColor:'rgba(90,45,10,0.25)'}}/>)}
// // // // //         <View style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>
// // // // //         <View style={{position:'absolute',left:'40%',bottom:20}}><ChalkPiece w={78}/></View>
// // // // //         <View style={{position:'absolute',left:'64%',bottom:22,transform:[{rotate:'-8deg'}]}}><ChalkPiece w={54}/></View>
// // // // //       </View>

// // // // //       {/* result card */}
// // // // //       {!!result&&<View style={bd.overlay}>
// // // // //         <Animated.View style={[bd.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // //           <Text style={bd.cardTitle}>Level complete!</Text>
// // // // //           <Text style={bd.cardMsg}>{result.message}</Text>
// // // // //           <View style={bd.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // // //           <Text style={bd.cardScore}>Score {result.score}</Text>
// // // // //           <TouchableOpacity style={bd.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // // //             <Text style={bd.nextT}>NEXT</Text>
// // // // //           </TouchableOpacity>
// // // // //         </Animated.View>
// // // // //       </View>}
// // // // //     </View></View>
// // // // //   </View>;
// // // // // }

// // // // // /* =========================================================
// // // // //    STYLES  (same green chalkboard as level 7, 8 and 9)
// // // // // ========================================================= */

// // // // // const bd=StyleSheet.create({
// // // // //   wall:{flex:1,backgroundColor:'#f1dcc0',paddingBottom:18},
// // // // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:8,backgroundColor:'#1f5b44',overflow:'hidden'},
// // // // //   board:{flex:1,alignItems:'center'},
// // // // //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
// // // // //   sheen:{position:'absolute',left:0,right:0,top:0,height:120,backgroundColor:'rgba(255,255,255,0.04)'},

// // // // //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// // // // //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// // // // //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // //   signWrap:{alignItems:'center',paddingTop:14},
// // // // //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// // // // //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
// // // // //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// // // // //   dashes:{gap:4,justifyContent:'center'},
// // // // //   dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
// // // // //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// // // // //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},

// // // // //   q:{fontFamily:F,fontSize:21,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:18,paddingHorizontal:12,
// // // // //     textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// // // // //   legend:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:30,marginTop:10},
// // // // //   lg:{flexDirection:'row',alignItems:'center',gap:4},
// // // // //   lgt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:CHALK},

// // // // //   actions:{position:'absolute',left:0,right:0,bottom:62,flexDirection:'row',justifyContent:'center',alignItems:'flex-start',gap:34},
// // // // //   acol:{alignItems:'center'},
// // // // //   lblRow:{flexDirection:'row',alignItems:'center',gap:3,height:20,marginTop:4},
// // // // //   lbl:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// // // // //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // // // //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},

// // // // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // // //   card:{width:'82%',alignItems:'center',backgroundColor:'#175a3d',borderWidth:3,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)',borderRadius:22,padding:20},
// // // // //   cardTitle:{fontFamily:F,fontSize:28,fontWeight:'800',color:'#fff'},
// // // // //   cardMsg:{fontFamily:F,fontSize:17,color:'#d8f3e3',textAlign:'center',marginTop:6},
// // // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // // //   cardScore:{fontFamily:F,fontSize:22,fontWeight:'700',color:'#ffd33d',marginTop:10},
// // // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:'#a6e22e',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // //   nextT:{fontFamily:F,fontSize:26,fontWeight:'900',color:INK},

// // // // //   load:{fontFamily:F,fontSize:22,color:CHALK,marginTop:12},
// // // // //   err:{fontFamily:F,fontSize:18,color:CHALK,textAlign:'center',paddingHorizontal:24},
// // // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:'#a6e22e',borderWidth:2.5,borderColor:INK},
// // // // //   retryT:{fontFamily:F,fontSize:20,fontWeight:'800',color:INK},
// // // // //   back:{fontFamily:F,fontSize:16,color:'#d8f3e3',marginTop:14,textDecorationLine:'underline'},
// // // // // });
// // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Animated,Easing,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // // import {Stage,Coin} from './BTShared';
// // // // import {Icon} from './Art';
// // // // import {BigStar} from './Btlevel7art';
// // // // import {Grid,XMark,OMark,StrikeLine} from './Btlevel10art';
// // // // import {startLevel10,hintLevel10,finishLevel10,skipLevel10,rewardLevel10,Level10View,Level10Result,Level10Action} from './Btlevel10api';
// // // // import {Board,Dir,Status,tap as playTap,tilt,tiltMoves,status as boardStatus,winLine} from './Btlevel10logic';
// // // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // const CHALK='#f6f4ea';

// // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // const CLUE_1='The winning move may be hiding in the place you least expect.';
// // // // const CLUE_2='Don’t try to finish the game. Find the one spot where your rival must move first!';

// // // // type Props={
// // // //   playerId:number;
// // // //   hints?:number;
// // // //   setHints?:(n:number)=>void;
// // // //   onExit:()=>void;
// // // //   onComplete?:(result:Level10Result)=>void;
// // // // };

// // // // type Piece={id:number;kind:number;cell:number};

// // // // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// // // // const ARROW_DEG:Record<Dir,string>={R:'0deg',D:'90deg',L:'180deg',U:'270deg'};

// // // // export default function BTLevel10Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // //   const {width,height}=useWindowDimensions();
// // // //   const RW=Math.min(width-24,360);
// // // //   const BS=Math.floor(clamp(Math.min(RW-60,height-430),170,280));   // the tic-tac-toe board in pixels
// // // //   const cs=BS/3;                                   // one square
// // // //   const ms=cs*0.8;                                 // size of an X or an O

// // // //   const [view,setView]=useState<Level10View|null>(null);
// // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // //   const [loadErr,setLoadErr]=useState('');
// // // //   const [msg,setMsg]=useState('');
// // // //   const [done,setDone]=useState(false);
// // // //   const [pieces,setPieces]=useState<Piece[]>([]);
// // // //   const [line,setLine]=useState<number[]|null>(null);
// // // //   const [hintDir,setHintDir]=useState<Dir|null>(null);
// // // //   const [result,setResult]=useState<Level10Result|null>(null);
// // // //   const [confirmSkip,setConfirmSkip]=useState(false);
// // // //   const [clueOpen,setClueOpen]=useState(false);
// // // //   const [clue2Shown,setClue2Shown]=useState(false);

// // // //   const pop=useRef(new Animated.Value(0)).current;
// // // //   const bob=useRef(new Animated.Value(0)).current;

// // // //   const geo=useRef({cs});
// // // //   geo.current={cs};
// // // //   const boardRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);     // the board as it is now
// // // //   const initialRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);   // the start board (restart goes back here)
// // // //   const actionsRef=useRef<Level10Action[]>([]);          // what the player did since the last restart
// // // //   const piecesRef=useRef<Piece[]>([]);
// // // //   const idRef=useRef(0);
// // // //   const posRef=useRef<Record<number,Animated.ValueXY>>({});
// // // //   const popRef=useRef<Record<number,Animated.Value>>({});
// // // //   const busyRef=useRef(false);
// // // //   const doneRef=useRef(false);
// // // //   const sessionRef=useRef<number|null>(null);
// // // //   const timers=useRef<any[]>([]);
// // // //   const msgTimer=useRef<any>(null);
// // // //   const later=(fn:()=>void,ms2:number)=>{timers.current.push(setTimeout(fn,ms2))};

// // // //   const flash=(m:string)=>{
// // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // //   };

// // // //   const setP=(list:Piece[])=>{piecesRef.current=list;setPieces(list)};
// // // //   const cellXY=(c:number)=>({x:(c%3)*geo.current.cs,y:Math.floor(c/3)*geo.current.cs});

// // // //   // a new X or O on the board
// // // //   const addPiece=(kind:number,cell:number)=>{
// // // //     const id=++idRef.current;
// // // //     posRef.current[id]=new Animated.ValueXY(cellXY(cell));
// // // //     popRef.current[id]=new Animated.Value(0);
// // // //     Animated.spring(popRef.current[id],{toValue:1,friction:4,tension:90,useNativeDriver:true}).start();
// // // //     setP([...piecesRef.current,{id,kind,cell}]);
// // // //   };

// // // //   // draw a whole board without animation
// // // //   const rebuild=(b:Board)=>{
// // // //     posRef.current={};popRef.current={};
// // // //     const list:Piece[]=[];
// // // //     b.forEach((v,i)=>{
// // // //       if(!v)return;
// // // //       const id=++idRef.current;
// // // //       posRef.current[id]=new Animated.ValueXY(cellXY(i));
// // // //       popRef.current[id]=new Animated.Value(1);
// // // //       list.push({id,kind:v,cell:i});
// // // //     });
// // // //     setP(list);
// // // //   };

// // // //   // 1. open the level - the backend picks a start board every time
// // // //   const load=useCallback(()=>{
// // // //     setLoadErr('');setView(null);
// // // //     startLevel10(playerId)
// // // //       .then(v=>{
// // // //         initialRef.current=v.board.slice();
// // // //         boardRef.current=v.board.slice();
// // // //         actionsRef.current=[];
// // // //         busyRef.current=false;
// // // //         doneRef.current=false;
// // // //         setDone(false);setResult(null);setLine(null);setHintDir(null);
// // // //         rebuild(v.board);
// // // //         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
// // // //         setView(v);
// // // //         if(setHints&&typeof v.hints==='number')setHints(v.hints);
// // // //       })
// // // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // // //   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

// // // //   useEffect(()=>{
// // // //     load();
// // // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // // //   },[load]);

// // // //   // the screen size changed: put every piece on its square again
// // // //   useEffect(()=>{
// // // //     piecesRef.current.forEach(p=>{const v=posRef.current[p.id];if(v)v.setValue(cellXY(p.cell))});
// // // //   },[cs]);                                         // eslint-disable-line react-hooks/exhaustive-deps

// // // //   useEffect(()=>{
// // // //     const b=Animated.loop(Animated.sequence([
// // // //       Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
// // // //       Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
// // // //     b.start();
// // // //     return()=>{b.stop()};
// // // //   },[]);

// // // //   useEffect(()=>{
// // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // //   },[result]);

// // // //   // 2. X won: send what the player did, the backend plays it again and saves the win
// // // //   const finish=async(attempt:number)=>{
// // // //     const sid=sessionRef.current;
// // // //     if(!sid)return;
// // // //     try{
// // // //       const r=await finishLevel10({sessionId:sid,playerId,actions:actionsRef.current.slice()});
// // // //       if(setHints&&typeof r.hints==='number')setHints(r.hints);
// // // //       setDone(true);
// // // //       later(()=>setResult(r),1300);
// // // //     }catch(e:any){
// // // //       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
// // // //       doneRef.current=false;
// // // //       flash(e.message||'Network error. Try again.');
// // // //       later(restart,1600);
// // // //     }
// // // //   };
// // // //   const finishRef=useRef(finish);
// // // //   finishRef.current=finish;

// // // //   // go back to the start board
// // // //   const restart=()=>{
// // // //     boardRef.current=initialRef.current.slice();
// // // //     actionsRef.current=[];
// // // //     setLine(null);setHintDir(null);
// // // //     rebuild(boardRef.current);
// // // //     busyRef.current=false;
// // // //   };

// // // //   // what happens after a move
// // // //   const settle=(s:Status)=>{
// // // //     if(s==='play'){busyRef.current=false;return}
// // // //     if(s==='win'){
// // // //       doneRef.current=true;
// // // //       setConfirmSkip(false);
// // // //       setLine(winLine(boardRef.current,1));
// // // //       finishRef.current(0);
// // // //       return;
// // // //     }
// // // //     flash(s==='lose'?'The rival wins! Try again...':'A draw is not a win! Try again...');
// // // //     later(restart,1700);
// // // //   };

// // // //   // tap a square: X goes there and the rival answers
// // // //   const onTap=(c:number)=>{
// // // //     if(busyRef.current||doneRef.current)return;
// // // //     const b=boardRef.current;
// // // //     if(b[c]!==0){flash('That square is taken!');return}
// // // //     busyRef.current=true;
// // // //     setHintDir(null);
// // // //     actionsRef.current.push({t:'tap',c});
// // // //     const r=playTap(b,c);
// // // //     boardRef.current=r.board;
// // // //     addPiece(1,c);
// // // //     if(r.rival>=0)later(()=>addPiece(2,r.rival),380);
// // // //     later(()=>settle(r.status),r.rival>=0?900:450);
// // // //   };

// // // //   // swipe the board: every piece slides to that side
// // // //   const onSwipe=(d:Dir)=>{
// // // //     if(busyRef.current||doneRef.current)return;
// // // //     const b=boardRef.current;
// // // //     const moves=tiltMoves(b,d);
// // // //     if(!moves.some(m=>m.from!==m.to)){flash('Nothing can slide that way');return}
// // // //     busyRef.current=true;
// // // //     setHintDir(null);
// // // //     actionsRef.current.push({t:'swipe',d});
// // // //     const nb=tilt(b,d);
// // // //     boardRef.current=nb;

// // // //     const to:Record<number,number>={};
// // // //     const anims:Animated.CompositeAnimation[]=[];
// // // //     moves.forEach(m=>{
// // // //       to[m.from]=m.to;
// // // //       if(m.from===m.to)return;
// // // //       const pc=piecesRef.current.find(p=>p.cell===m.from);
// // // //       const v=pc&&posRef.current[pc.id];
// // // //       if(v)anims.push(Animated.timing(v,{toValue:cellXY(m.to),duration:340,easing:Easing.out(Easing.cubic),useNativeDriver:true}));
// // // //     });
// // // //     Animated.parallel(anims).start(()=>{
// // // //       setP(piecesRef.current.map(p=>({...p,cell:to[p.cell]!==undefined?to[p.cell]:p.cell})));
// // // //       settle(boardStatus(nb));
// // // //     });
// // // //   };

// // // //   const onTapRef=useRef(onTap);onTapRef.current=onTap;
// // // //   const onSwipeRef=useRef(onSwipe);onSwipeRef.current=onSwipe;
// // // //   const gl=useRef({x:0,y:0});

// // // //   // touch on the board: a short touch = tap a square, a drag = swipe the board
// // // //   const pan=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // //     onPanResponderTerminationRequest:()=>false,
// // // //     onPanResponderGrant:(e)=>{
// // // //       gl.current={x:e.nativeEvent.locationX,y:e.nativeEvent.locationY};
// // // //       setConfirmSkip(false);
// // // //     },
// // // //     onPanResponderRelease:(_e,g)=>{
// // // //       const dist=Math.hypot(g.dx,g.dy);
// // // //       if(dist<14){
// // // //         const q=geo.current;
// // // //         const col=clamp(Math.floor(gl.current.x/q.cs),0,2),row=clamp(Math.floor(gl.current.y/q.cs),0,2);
// // // //         onTapRef.current(row*3+col);
// // // //       }else if(dist>=26){
// // // //         const d:Dir=Math.abs(g.dx)>Math.abs(g.dy)?(g.dx>0?'R':'L'):(g.dy>0?'D':'U');
// // // //         onSwipeRef.current(d);
// // // //       }
// // // //     },
// // // //   })).current;

// // // //   // magnifier: the server tells which way to swipe (25 hints), then the CLUES popup opens
// // // //   const onHint=async()=>{
// // // //     if(done||!sessionId)return;
// // // //     setConfirmSkip(false);
// // // //     try{
// // // //       const r=await hintLevel10({sessionId,playerId,board:boardRef.current});
// // // //       setHints&&setHints(r.hints);
// // // //       setHintDir(r.dir);
// // // //       later(()=>setHintDir(null),6000);
// // // //       setClue2Shown(false);
// // // //       setClueOpen(true);
// // // //     }catch(e:any){
// // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // //     }
// // // //   };

// // // //   // video reward (+75 hints)
// // // //   const onReward=async()=>{
// // // //     if(done)return;
// // // //     setConfirmSkip(false);
// // // //     try{
// // // //       const r=await rewardLevel10(playerId);
// // // //       setHints&&setHints(r.hints);
// // // //       flash('+'+r.added+' hints');
// // // //     }catch(e:any){
// // // //       flash(e.message||'Network error');
// // // //     }
// // // //   };

// // // //   // skip (50 hints): tap twice
// // // //   const onSkip=async()=>{
// // // //     if(done||!sessionId)return;
// // // //     if(!confirmSkip){
// // // //       setConfirmSkip(true);
// // // //       flash('Skip costs 50 hints. Tap again to skip.');
// // // //       return;
// // // //     }
// // // //     try{
// // // //       const r=await skipLevel10({sessionId,playerId});
// // // //       setHints&&setHints(r.hints||0);
// // // //       doneRef.current=true;
// // // //       onComplete?onComplete(r):onExit();
// // // //     }catch(e:any){
// // // //       setConfirmSkip(false);
// // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // //     }
// // // //   };

// // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // //   const header=(
// // // //     <View style={st.topBar}>
// // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // // //         <Icon n="home" s={16}/>
// // // //       </TouchableOpacity>

// // // //       <View style={st.signWrap}>
// // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // //         <View style={st.sign}>
// // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // //           <Text style={st.signT}>LEVEL 10</Text>
// // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // //         </View>
// // // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // // //       </View>

// // // //       <View style={st.pill}>
// // // //         <Text style={st.pillT}>{hints}</Text>
// // // //         <Text style={st.pillIcon}>💡</Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   /* ---------- loading / error ---------- */

// // // //   if(loadErr||!view){
// // // //     return <Stage bg="#bddaee"><View style={st.root}>
// // // //       <RoomBackground/>
// // // //       {header}
// // // //       <View style={st.centerMsg}>
// // // //         {loadErr?<>
// // // //           <Text style={st.err}>{loadErr}</Text>
// // // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // //         </>:<>
// // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // //           <Text style={st.load}>Loading level 10...</Text>
// // // //         </>}
// // // //       </View>
// // // //     </View></Stage>;
// // // //   }

// // // //   const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
// // // //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

// // // //   return <Stage bg="#bddaee"><View style={st.root}>
// // // //     <RoomBackground/>
// // // //     {header}

// // // //     <View style={st.center}>
// // // //       {/* question pill (same as level 1) */}
// // // //       <View style={st.qPill}>
// // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // //       </View>

// // // //       {/* a small chalkboard on the wall: who is who + the tic-tac-toe board */}
// // // //       <View style={st.chalk}>
// // // //         <View style={st.legend}>
// // // //           <View style={st.lg}><XMark s={34}/><Text style={st.lgt}>: YOU</Text></View>
// // // //           <View style={st.lg}><OMark s={34}/><Text style={st.lgt}>: RIVAL</Text></View>
// // // //         </View>

// // // //         <View style={{marginTop:8,width:BS,height:BS}}>
// // // //           <Grid size={BS}/>

// // // //           {pieces.map(p=>{
// // // //             const pos=posRef.current[p.id],pp=popRef.current[p.id];
// // // //             if(!pos||!pp)return null;
// // // //             return <Animated.View key={p.id} pointerEvents="none"
// // // //               style={{position:'absolute',left:0,top:0,width:cs,height:cs,alignItems:'center',justifyContent:'center',
// // // //                 transform:[...pos.getTranslateTransform(),{scale:pp}]}}>
// // // //               {p.kind===1?<XMark s={ms}/>:<OMark s={ms}/>}
// // // //             </Animated.View>;
// // // //           })}

// // // //           {!!line&&<View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line}/></View>}

// // // //           {/* magnifier: which way to swipe */}
// // // //           {!!hintDir&&<View pointerEvents="none" style={[StyleSheet.absoluteFill,{alignItems:'center',justifyContent:'center'}]}>
// // // //             <Animated.Text style={{fontSize:76,color:'#ffd33d',opacity:0.85,fontWeight:'bold',
// // // //               transform:[{rotate:ARROW_DEG[hintDir]},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>
// // // //           </View>}

// // // //           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// // // //         </View>
// // // //       </View>
// // // //     </View>

// // // //     {/* bottom rounded panel (same as level 1) */}
// // // //     <View style={st.panel}>
// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
// // // //           <Icon n="film" s={36}/>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // //       </View>

// // // //       <View style={st.btnCol}>
// // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// // // //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// // // //         </TouchableOpacity>
// // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // //       </View>
// // // //     </View>

// // // //     {/* CLUES popup (only from the magnifier) */}
// // // //     {clueOpen&&<View style={st.overlay}>
// // // //       <View style={st.clueCard}>
// // // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// // // //           <Text style={st.closeT}>✕</Text>
// // // //         </TouchableOpacity>
// // // //         <Text style={st.clueTitle}>CLUES</Text>

// // // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // // //           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// // // //           <View style={{flex:1}}>
// // // //             <Text style={st.clueHead}>Clue 1</Text>
// // // //             <Text style={st.clueBody}>{CLUE_1}</Text>
// // // //           </View>
// // // //         </View>

// // // //         <TouchableOpacity activeOpacity={0.9} onPress={()=>setClue2Shown(true)}
// // // //           style={[st.clueRow,clue2Shown?st.clueRowOpen:st.clueRowLocked]}>
// // // //           <View style={st.clueNum}><Text style={st.clueNumT}>2</Text></View>
// // // //           <View style={{flex:1}}>
// // // //             <Text style={st.clueHead}>Clue 2</Text>
// // // //             <Text style={clue2Shown?st.clueBody:st.clueTap}>{clue2Shown?CLUE_2:'Tap to reveal'}</Text>
// // // //           </View>
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     </View>}

// // // //     {/* result card */}
// // // //     {!!result&&<View style={st.overlay}>
// // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // //           <Text style={st.nextT}>NEXT</Text>
// // // //         </TouchableOpacity>
// // // //       </Animated.View>
// // // //     </View>}
// // // //   </View></Stage>;
// // // // }

// // // // /* =========================================================
// // // //    STYLES  (same room theme as Level 1)
// // // // ========================================================= */

// // // // const st=StyleSheet.create({
// // // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // // //   pillIcon:{fontSize:16},

// // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
// // // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

// // // //   chalk:{backgroundColor:'#1f5b44',borderWidth:6,borderColor:'#d98b3d',borderRadius:14,paddingHorizontal:14,paddingTop:10,paddingBottom:14,alignItems:'center'},
// // // //   legend:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:26},
// // // //   lg:{flexDirection:'row',alignItems:'center',gap:4},
// // // //   lgt:{fontFamily:FONT,fontSize:20,fontWeight:'bold',color:CHALK},

// // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // //   btnCol:{alignItems:'center'},
// // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:22},
// // // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // // //   clueRowLocked:{backgroundColor:'#f8e3ae',borderColor:'#f3b73a'},
// // // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},
// // // //   clueTap:{fontFamily:FONT,fontSize:15,fontWeight:'800',color:'#7a4a2a',marginTop:2},

// // // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // // });
// // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Animated,Easing,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // import {Stage,Coin} from './BTShared';
// // // import {Icon} from './Art';
// // // import {BigStar} from './Btlevel7art';
// // // import {Grid,XMark,OMark,StrikeLine} from './Btlevel10art';
// // // import {startLevel10,hintLevel10,finishLevel10,skipLevel10,rewardLevel10,Level10View,Level10Result,Level10Action} from './Btlevel10api';
// // // import {Board,Dir,Status,tap as playTap,tilt,tiltMoves,status as boardStatus,winLine} from './Btlevel10logic';
// // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // const CHALK='#f6f4ea';

// // // // clue shown in the CLUES popup when the magnifier (search icon) is tapped
// // // const CLUE_1='Your rival is one move away from victory… can you spot the place you need to protect?';

// // // type Props={
// // //   playerId:number;
// // //   hints?:number;
// // //   setHints?:(n:number)=>void;
// // //   onExit:()=>void;
// // //   onComplete?:(result:Level10Result)=>void;
// // // };

// // // type Piece={id:number;kind:number;cell:number};

// // // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// // // const ARROW_DEG:Record<Dir,string>={R:'0deg',D:'90deg',L:'180deg',U:'270deg'};

// // // export default function BTLevel10Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // //   const {width,height}=useWindowDimensions();
// // //   const RW=Math.min(width-24,360);
// // //   const BS=Math.floor(clamp(Math.min(RW-60,height-430),170,280));   // the tic-tac-toe board in pixels
// // //   const cs=BS/3;                                   // one square
// // //   const ms=cs*0.8;                                 // size of an X or an O

// // //   const [view,setView]=useState<Level10View|null>(null);
// // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // //   const [loadErr,setLoadErr]=useState('');
// // //   const [msg,setMsg]=useState('');
// // //   const [done,setDone]=useState(false);
// // //   const [pieces,setPieces]=useState<Piece[]>([]);
// // //   const [line,setLine]=useState<number[]|null>(null);
// // //   const [hintDir,setHintDir]=useState<Dir|null>(null);
// // //   const [result,setResult]=useState<Level10Result|null>(null);
// // //   const [confirmSkip,setConfirmSkip]=useState(false);
// // //   const [clueOpen,setClueOpen]=useState(false);

// // //   const pop=useRef(new Animated.Value(0)).current;
// // //   const bob=useRef(new Animated.Value(0)).current;

// // //   const geo=useRef({cs});
// // //   geo.current={cs};
// // //   const boardRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);     // the board as it is now
// // //   const initialRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);   // the start board (restart goes back here)
// // //   const actionsRef=useRef<Level10Action[]>([]);          // what the player did since the last restart
// // //   const piecesRef=useRef<Piece[]>([]);
// // //   const idRef=useRef(0);
// // //   const posRef=useRef<Record<number,Animated.ValueXY>>({});
// // //   const popRef=useRef<Record<number,Animated.Value>>({});
// // //   const busyRef=useRef(false);
// // //   const doneRef=useRef(false);
// // //   const sessionRef=useRef<number|null>(null);
// // //   const timers=useRef<any[]>([]);
// // //   const msgTimer=useRef<any>(null);
// // //   const later=(fn:()=>void,ms2:number)=>{timers.current.push(setTimeout(fn,ms2))};

// // //   const flash=(m:string)=>{
// // //     setMsg(m);clearTimeout(msgTimer.current);
// // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // //   };

// // //   const setP=(list:Piece[])=>{piecesRef.current=list;setPieces(list)};
// // //   const cellXY=(c:number)=>({x:(c%3)*geo.current.cs,y:Math.floor(c/3)*geo.current.cs});

// // //   // a new X or O on the board
// // //   const addPiece=(kind:number,cell:number)=>{
// // //     const id=++idRef.current;
// // //     posRef.current[id]=new Animated.ValueXY(cellXY(cell));
// // //     popRef.current[id]=new Animated.Value(0);
// // //     Animated.spring(popRef.current[id],{toValue:1,friction:4,tension:90,useNativeDriver:true}).start();
// // //     setP([...piecesRef.current,{id,kind,cell}]);
// // //   };

// // //   // draw a whole board without animation
// // //   const rebuild=(b:Board)=>{
// // //     posRef.current={};popRef.current={};
// // //     const list:Piece[]=[];
// // //     b.forEach((v,i)=>{
// // //       if(!v)return;
// // //       const id=++idRef.current;
// // //       posRef.current[id]=new Animated.ValueXY(cellXY(i));
// // //       popRef.current[id]=new Animated.Value(1);
// // //       list.push({id,kind:v,cell:i});
// // //     });
// // //     setP(list);
// // //   };

// // //   // 1. open the level - the backend picks a start board every time
// // //   const load=useCallback(()=>{
// // //     setLoadErr('');setView(null);
// // //     startLevel10(playerId)
// // //       .then(v=>{
// // //         initialRef.current=v.board.slice();
// // //         boardRef.current=v.board.slice();
// // //         actionsRef.current=[];
// // //         busyRef.current=false;
// // //         doneRef.current=false;
// // //         setDone(false);setResult(null);setLine(null);setHintDir(null);
// // //         rebuild(v.board);
// // //         setSessionId(v.sessionId);sessionRef.current=v.sessionId;
// // //         setView(v);
// // //         if(setHints&&typeof v.hints==='number')setHints(v.hints);
// // //       })
// // //       .catch((e:any)=>setLoadErr(e.message||'Cannot reach the server'));
// // //   },[playerId]);                                   // eslint-disable-line react-hooks/exhaustive-deps

// // //   useEffect(()=>{
// // //     load();
// // //     return()=>{timers.current.forEach(clearTimeout);clearTimeout(msgTimer.current)};
// // //   },[load]);

// // //   // the screen size changed: put every piece on its square again
// // //   useEffect(()=>{
// // //     piecesRef.current.forEach(p=>{const v=posRef.current[p.id];if(v)v.setValue(cellXY(p.cell))});
// // //   },[cs]);                                         // eslint-disable-line react-hooks/exhaustive-deps

// // //   useEffect(()=>{
// // //     const b=Animated.loop(Animated.sequence([
// // //       Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
// // //       Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
// // //     b.start();
// // //     return()=>{b.stop()};
// // //   },[]);

// // //   useEffect(()=>{
// // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // //   },[result]);

// // //   // 2. X won: send what the player did, the backend plays it again and saves the win
// // //   const finish=async(attempt:number)=>{
// // //     const sid=sessionRef.current;
// // //     if(!sid)return;
// // //     try{
// // //       const r=await finishLevel10({sessionId:sid,playerId,actions:actionsRef.current.slice()});
// // //       if(setHints&&typeof r.hints==='number')setHints(r.hints);
// // //       setDone(true);
// // //       later(()=>setResult(r),1300);
// // //     }catch(e:any){
// // //       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
// // //       doneRef.current=false;
// // //       flash(e.message||'Network error. Try again.');
// // //       later(restart,1600);
// // //     }
// // //   };
// // //   const finishRef=useRef(finish);
// // //   finishRef.current=finish;

// // //   // go back to the start board
// // //   const restart=()=>{
// // //     boardRef.current=initialRef.current.slice();
// // //     actionsRef.current=[];
// // //     setLine(null);setHintDir(null);
// // //     rebuild(boardRef.current);
// // //     busyRef.current=false;
// // //   };

// // //   // what happens after a move
// // //   const settle=(s:Status)=>{
// // //     if(s==='play'){busyRef.current=false;return}
// // //     if(s==='win'){
// // //       doneRef.current=true;
// // //       setConfirmSkip(false);
// // //       setLine(winLine(boardRef.current,1));
// // //       finishRef.current(0);
// // //       return;
// // //     }
// // //     flash(s==='lose'?'The rival wins! Try again...':'A draw is not a win! Try again...');
// // //     later(restart,1700);
// // //   };

// // //   // tap a square: X goes there and the rival answers
// // //   const onTap=(c:number)=>{
// // //     if(busyRef.current||doneRef.current)return;
// // //     const b=boardRef.current;
// // //     if(b[c]!==0){flash('That square is taken!');return}
// // //     busyRef.current=true;
// // //     setHintDir(null);
// // //     actionsRef.current.push({t:'tap',c});
// // //     const r=playTap(b,c);
// // //     boardRef.current=r.board;
// // //     addPiece(1,c);
// // //     if(r.rival>=0)later(()=>addPiece(2,r.rival),380);
// // //     later(()=>settle(r.status),r.rival>=0?900:450);
// // //   };

// // //   // swipe the board: every piece slides to that side
// // //   const onSwipe=(d:Dir)=>{
// // //     if(busyRef.current||doneRef.current)return;
// // //     const b=boardRef.current;
// // //     const moves=tiltMoves(b,d);
// // //     if(!moves.some(m=>m.from!==m.to)){flash('Nothing can slide that way');return}
// // //     busyRef.current=true;
// // //     setHintDir(null);
// // //     actionsRef.current.push({t:'swipe',d});
// // //     const nb=tilt(b,d);
// // //     boardRef.current=nb;

// // //     const to:Record<number,number>={};
// // //     const anims:Animated.CompositeAnimation[]=[];
// // //     moves.forEach(m=>{
// // //       to[m.from]=m.to;
// // //       if(m.from===m.to)return;
// // //       const pc=piecesRef.current.find(p=>p.cell===m.from);
// // //       const v=pc&&posRef.current[pc.id];
// // //       if(v)anims.push(Animated.timing(v,{toValue:cellXY(m.to),duration:340,easing:Easing.out(Easing.cubic),useNativeDriver:true}));
// // //     });
// // //     Animated.parallel(anims).start(()=>{
// // //       setP(piecesRef.current.map(p=>({...p,cell:to[p.cell]!==undefined?to[p.cell]:p.cell})));
// // //       settle(boardStatus(nb));
// // //     });
// // //   };

// // //   const onTapRef=useRef(onTap);onTapRef.current=onTap;
// // //   const onSwipeRef=useRef(onSwipe);onSwipeRef.current=onSwipe;
// // //   const gl=useRef({x:0,y:0});

// // //   // touch on the board: a short touch = tap a square, a drag = swipe the board
// // //   const pan=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // //     onPanResponderTerminationRequest:()=>false,
// // //     onPanResponderGrant:(e)=>{
// // //       gl.current={x:e.nativeEvent.locationX,y:e.nativeEvent.locationY};
// // //       setConfirmSkip(false);
// // //     },
// // //     onPanResponderRelease:(_e,g)=>{
// // //       const dist=Math.hypot(g.dx,g.dy);
// // //       if(dist<14){
// // //         const q=geo.current;
// // //         const col=clamp(Math.floor(gl.current.x/q.cs),0,2),row=clamp(Math.floor(gl.current.y/q.cs),0,2);
// // //         onTapRef.current(row*3+col);
// // //       }else if(dist>=26){
// // //         const d:Dir=Math.abs(g.dx)>Math.abs(g.dy)?(g.dx>0?'R':'L'):(g.dy>0?'D':'U');
// // //         onSwipeRef.current(d);
// // //       }
// // //     },
// // //   })).current;

// // //   // magnifier (search icon): costs 25 hints, shows the swipe arrow and opens the CLUES popup directly
// // //   const onHint=async()=>{
// // //     if(done||!sessionId)return;
// // //     setConfirmSkip(false);
// // //     try{
// // //       const r=await hintLevel10({sessionId,playerId,board:boardRef.current});
// // //       setHints&&setHints(r.hints);
// // //       setHintDir(r.dir);
// // //       later(()=>setHintDir(null),6000);
// // //       setClueOpen(true);
// // //     }catch(e:any){
// // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // //     }
// // //   };

// // //   // video reward (+75 hints) - only adds hints, never opens the clue popup
// // //   const onReward=async()=>{
// // //     if(done)return;
// // //     setConfirmSkip(false);
// // //     try{
// // //       const r=await rewardLevel10(playerId);
// // //       setHints&&setHints(r.hints);
// // //       flash('+'+r.added+' hints');
// // //     }catch(e:any){
// // //       flash(e.message||'Network error');
// // //     }
// // //   };

// // //   // skip (50 hints): tap twice
// // //   const onSkip=async()=>{
// // //     if(done||!sessionId)return;
// // //     if(!confirmSkip){
// // //       setConfirmSkip(true);
// // //       flash('Skip costs 50 hints. Tap again to skip.');
// // //       return;
// // //     }
// // //     try{
// // //       const r=await skipLevel10({sessionId,playerId});
// // //       setHints&&setHints(r.hints||0);
// // //       doneRef.current=true;
// // //       onComplete?onComplete(r):onExit();
// // //     }catch(e:any){
// // //       setConfirmSkip(false);
// // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // //     }
// // //   };

// // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // //   const header=(
// // //     <View style={st.topBar}>
// // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // //         <Icon n="home" s={16}/>
// // //       </TouchableOpacity>

// // //       <View style={st.signWrap}>
// // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // //         <View style={st.sign}>
// // //           <Text style={st.signArrow}>{'<'}</Text>
// // //           <Text style={st.signT}>LEVEL 10</Text>
// // //           <Text style={st.signArrow}>{'>'}</Text>
// // //         </View>
// // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // //       </View>

// // //       <View style={st.pill}>
// // //         <Text style={st.pillT}>{hints}</Text>
// // //         <Text style={st.pillIcon}>💡</Text>
// // //       </View>
// // //     </View>
// // //   );

// // //   /* ---------- loading / error ---------- */

// // //   if(loadErr||!view){
// // //     return <Stage bg="#bddaee"><View style={st.root}>
// // //       <RoomBackground/>
// // //       {header}
// // //       <View style={st.centerMsg}>
// // //         {loadErr?<>
// // //           <Text style={st.err}>{loadErr}</Text>
// // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // //         </>:<>
// // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // //           <Text style={st.load}>Loading level 10...</Text>
// // //         </>}
// // //       </View>
// // //     </View></Stage>;
// // //   }

// // //   const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
// // //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

// // //   return <Stage bg="#bddaee"><View style={st.root}>
// // //     <RoomBackground/>
// // //     {header}

// // //     <View style={st.center}>
// // //       {/* question pill (same as level 1) */}
// // //       <View style={st.qPill}>
// // //         <Text style={st.qArrow}>{'<'}</Text>
// // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // //         <Text style={st.qArrow}>{'>'}</Text>
// // //       </View>

// // //       {/* a small chalkboard on the wall: who is who + the tic-tac-toe board */}
// // //       <View style={st.chalk}>
// // //         <View style={st.legend}>
// // //           <View style={st.lg}><XMark s={34}/><Text style={st.lgt}>: YOU</Text></View>
// // //           <View style={st.lg}><OMark s={34}/><Text style={st.lgt}>: RIVAL</Text></View>
// // //         </View>

// // //         <View style={{marginTop:8,width:BS,height:BS}}>
// // //           <Grid size={BS}/>

// // //           {pieces.map(p=>{
// // //             const pos=posRef.current[p.id],pp=popRef.current[p.id];
// // //             if(!pos||!pp)return null;
// // //             return <Animated.View key={p.id} pointerEvents="none"
// // //               style={{position:'absolute',left:0,top:0,width:cs,height:cs,alignItems:'center',justifyContent:'center',
// // //                 transform:[...pos.getTranslateTransform(),{scale:pp}]}}>
// // //               {p.kind===1?<XMark s={ms}/>:<OMark s={ms}/>}
// // //             </Animated.View>;
// // //           })}

// // //           {!!line&&<View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line}/></View>}

// // //           {/* magnifier: which way to swipe */}
// // //           {!!hintDir&&<View pointerEvents="none" style={[StyleSheet.absoluteFill,{alignItems:'center',justifyContent:'center'}]}>
// // //             <Animated.Text style={{fontSize:76,color:'#ffd33d',opacity:0.85,fontWeight:'bold',
// // //               transform:[{rotate:ARROW_DEG[hintDir]},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>
// // //           </View>}

// // //           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// // //         </View>
// // //       </View>
// // //     </View>

// // //     {/* bottom rounded panel (same as level 1) */}
// // //     <View style={st.panel}>
// // //       <View style={st.btnCol}>
// // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
// // //           <Icon n="film" s={36}/>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // //       </View>

// // //       <View style={st.btnCol}>
// // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// // //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// // //         </TouchableOpacity>
// // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // //       </View>
// // //     </View>

// // //     {/* CLUES popup (only from the magnifier / search icon) */}
// // //     {clueOpen&&<View style={st.overlay}>
// // //       <View style={st.clueCard}>
// // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// // //           <Text style={st.closeT}>✕</Text>
// // //         </TouchableOpacity>
// // //         <Text style={st.clueTitle}>CLUES</Text>

// // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // //           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// // //           <View style={{flex:1}}>
// // //             <Text style={st.clueHead}>Clue 1</Text>
// // //             <Text style={st.clueBody}>{CLUE_1}</Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //     </View>}

// // //     {/* result card */}
// // //     {!!result&&<View style={st.overlay}>
// // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // //         <Text style={st.cardTitle}>Level complete!</Text>
// // //         <Text style={st.cardMsg}>{result.message}</Text>
// // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // //           <Text style={st.nextT}>NEXT</Text>
// // //         </TouchableOpacity>
// // //       </Animated.View>
// // //     </View>}
// // //   </View></Stage>;
// // // }

// // // /* =========================================================
// // //    STYLES  (same room theme as Level 1)
// // // ========================================================= */

// // // const st=StyleSheet.create({
// // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // //   pillIcon:{fontSize:16},

// // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
// // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

// // //   chalk:{backgroundColor:'#1f5b44',borderWidth:6,borderColor:'#d98b3d',borderRadius:14,paddingHorizontal:14,paddingTop:10,paddingBottom:14,alignItems:'center'},
// // //   legend:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:26},
// // //   lg:{flexDirection:'row',alignItems:'center',gap:4},
// // //   lgt:{fontFamily:FONT,fontSize:20,fontWeight:'bold',color:CHALK},

// // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // //   btnCol:{alignItems:'center'},
// // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
// // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

// // //   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // });
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

// //   // magnifier (search icon): costs 25 hints, shows the swipe arrow and opens the CLUES popup directly
// //   const onHint=async()=>{
// //     if(done)return;
// //     setConfirmSkip(false);
// //     setClueOpen(true);                             // clue popup opens right away, always
// //     if(!sessionId)return;
// //     try{
// //       const r=await hintLevel10({sessionId,playerId,board:boardRef.current});
// //       setHints&&setHints(r.hints);
// //       setHintDir(r.dir);
// //       later(()=>setHintDir(null),6000);
// //     }catch(e:any){
// //       // not enough hints / network error: the clue stays visible, only the arrow is skipped
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
// //             <Text style={st.clueBody}>{CLUE_1}</Text>
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
// import React,{useCallback,useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,Easing,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// import {Stage,Coin} from './BTShared';
// import {Icon} from './Art';
// import {BigStar} from './Btlevel7art';
// import {Grid,XMark,OMark,StrikeLine} from './Btlevel10art';
// import {startLevel10,hintLevel10,finishLevel10,skipLevel10,rewardLevel10,Level10View,Level10Result,Level10Action} from './Btlevel10api';
// import {Board,Dir,Status,tap as playTap,tilt,tiltMoves,status as boardStatus,winLine} from './Btlevel10logic';
// import {RoomBackground,THEME} from './Btlevel4Theme';

// const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// const CHALK='#f6f4ea';

// // clue shown in the CLUES popup when the magnifier (search icon) is tapped
// const CLUE_1='Your rival is one move away from victory… can you spot the place you need to protect?';

// type Props={
//   playerId:number;
//   hints?:number;
//   setHints?:(n:number)=>void;
//   onExit:()=>void;
//   onComplete?:(result:Level10Result)=>void;
// };

// type Piece={id:number;kind:number;cell:number};

// const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// const ARROW_DEG:Record<Dir,string>={R:'0deg',D:'90deg',L:'180deg',U:'270deg'};

// export default function BTLevel10Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
//   const {width,height}=useWindowDimensions();
//   const RW=Math.min(width-24,360);
//   const BS=Math.floor(clamp(Math.min(RW-60,height-430),170,280));   // the tic-tac-toe board in pixels
//   const cs=BS/3;                                   // one square
//   const ms=cs*0.8;                                 // size of an X or an O

//   const [view,setView]=useState<Level10View|null>(null);
//   const [sessionId,setSessionId]=useState<number|null>(null);
//   const [loadErr,setLoadErr]=useState('');
//   const [msg,setMsg]=useState('');
//   const [done,setDone]=useState(false);
//   const [pieces,setPieces]=useState<Piece[]>([]);
//   const [line,setLine]=useState<number[]|null>(null);
//   const [hintDir,setHintDir]=useState<Dir|null>(null);
//   const [result,setResult]=useState<Level10Result|null>(null);
//   const [confirmSkip,setConfirmSkip]=useState(false);
//   const [clueOpen,setClueOpen]=useState(false);

//   const pop=useRef(new Animated.Value(0)).current;
//   const bob=useRef(new Animated.Value(0)).current;

//   const geo=useRef({cs});
//   geo.current={cs};
//   const boardRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);     // the board as it is now
//   const initialRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);   // the start board (restart goes back here)
//   const actionsRef=useRef<Level10Action[]>([]);          // what the player did since the last restart
//   const piecesRef=useRef<Piece[]>([]);
//   const idRef=useRef(0);
//   const posRef=useRef<Record<number,Animated.ValueXY>>({});
//   const popRef=useRef<Record<number,Animated.Value>>({});
//   const busyRef=useRef(false);
//   const doneRef=useRef(false);
//   const sessionRef=useRef<number|null>(null);
//   const timers=useRef<any[]>([]);
//   const msgTimer=useRef<any>(null);
//   const later=(fn:()=>void,ms2:number)=>{timers.current.push(setTimeout(fn,ms2))};

//   const flash=(m:string)=>{
//     setMsg(m);clearTimeout(msgTimer.current);
//     msgTimer.current=setTimeout(()=>setMsg(''),2800);
//   };

//   const setP=(list:Piece[])=>{piecesRef.current=list;setPieces(list)};
//   const cellXY=(c:number)=>({x:(c%3)*geo.current.cs,y:Math.floor(c/3)*geo.current.cs});

//   // a new X or O on the board
//   const addPiece=(kind:number,cell:number)=>{
//     const id=++idRef.current;
//     posRef.current[id]=new Animated.ValueXY(cellXY(cell));
//     popRef.current[id]=new Animated.Value(0);
//     Animated.spring(popRef.current[id],{toValue:1,friction:4,tension:90,useNativeDriver:true}).start();
//     setP([...piecesRef.current,{id,kind,cell}]);
//   };

//   // draw a whole board without animation
//   const rebuild=(b:Board)=>{
//     posRef.current={};popRef.current={};
//     const list:Piece[]=[];
//     b.forEach((v,i)=>{
//       if(!v)return;
//       const id=++idRef.current;
//       posRef.current[id]=new Animated.ValueXY(cellXY(i));
//       popRef.current[id]=new Animated.Value(1);
//       list.push({id,kind:v,cell:i});
//     });
//     setP(list);
//   };

//   // 1. open the level - the backend picks a start board every time
//   const load=useCallback(()=>{
//     setLoadErr('');setView(null);
//     startLevel10(playerId)
//       .then(v=>{
//         initialRef.current=v.board.slice();
//         boardRef.current=v.board.slice();
//         actionsRef.current=[];
//         busyRef.current=false;
//         doneRef.current=false;
//         setDone(false);setResult(null);setLine(null);setHintDir(null);
//         rebuild(v.board);
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

//   // the screen size changed: put every piece on its square again
//   useEffect(()=>{
//     piecesRef.current.forEach(p=>{const v=posRef.current[p.id];if(v)v.setValue(cellXY(p.cell))});
//   },[cs]);                                         // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(()=>{
//     const b=Animated.loop(Animated.sequence([
//       Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
//       Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
//     b.start();
//     return()=>{b.stop()};
//   },[]);

//   useEffect(()=>{
//     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
//   },[result]);

//   // 2. X won: send what the player did, the backend plays it again and saves the win
//   const finish=async(attempt:number)=>{
//     const sid=sessionRef.current;
//     if(!sid)return;
//     try{
//       const r=await finishLevel10({sessionId:sid,playerId,actions:actionsRef.current.slice()});
//       if(setHints&&typeof r.hints==='number')setHints(r.hints);
//       setDone(true);
//       later(()=>setResult(r),1300);
//     }catch(e:any){
//       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
//       doneRef.current=false;
//       flash(e.message||'Network error. Try again.');
//       later(restart,1600);
//     }
//   };
//   const finishRef=useRef(finish);
//   finishRef.current=finish;

//   // go back to the start board
//   const restart=()=>{
//     boardRef.current=initialRef.current.slice();
//     actionsRef.current=[];
//     setLine(null);setHintDir(null);
//     rebuild(boardRef.current);
//     busyRef.current=false;
//   };

//   // what happens after a move
//   const settle=(s:Status)=>{
//     if(s==='play'){busyRef.current=false;return}
//     if(s==='win'){
//       doneRef.current=true;
//       setConfirmSkip(false);
//       setLine(winLine(boardRef.current,1));
//       finishRef.current(0);
//       return;
//     }
//     flash(s==='lose'?'The rival wins! Try again...':'A draw is not a win! Try again...');
//     later(restart,1700);
//   };

//   // tap a square: X goes there and the rival answers
//   const onTap=(c:number)=>{
//     if(busyRef.current||doneRef.current)return;
//     const b=boardRef.current;
//     if(b[c]!==0){flash('That square is taken!');return}
//     busyRef.current=true;
//     setHintDir(null);
//     actionsRef.current.push({t:'tap',c});
//     const r=playTap(b,c);
//     boardRef.current=r.board;
//     addPiece(1,c);
//     if(r.rival>=0)later(()=>addPiece(2,r.rival),380);
//     later(()=>settle(r.status),r.rival>=0?900:450);
//   };

//   // swipe the board: every piece slides to that side
//   const onSwipe=(d:Dir)=>{
//     if(busyRef.current||doneRef.current)return;
//     const b=boardRef.current;
//     const moves=tiltMoves(b,d);
//     if(!moves.some(m=>m.from!==m.to)){flash('Nothing can slide that way');return}
//     busyRef.current=true;
//     setHintDir(null);
//     actionsRef.current.push({t:'swipe',d});
//     const nb=tilt(b,d);
//     boardRef.current=nb;

//     const to:Record<number,number>={};
//     const anims:Animated.CompositeAnimation[]=[];
//     moves.forEach(m=>{
//       to[m.from]=m.to;
//       if(m.from===m.to)return;
//       const pc=piecesRef.current.find(p=>p.cell===m.from);
//       const v=pc&&posRef.current[pc.id];
//       if(v)anims.push(Animated.timing(v,{toValue:cellXY(m.to),duration:340,easing:Easing.out(Easing.cubic),useNativeDriver:true}));
//     });
//     Animated.parallel(anims).start(()=>{
//       setP(piecesRef.current.map(p=>({...p,cell:to[p.cell]!==undefined?to[p.cell]:p.cell})));
//       settle(boardStatus(nb));
//     });
//   };

//   const onTapRef=useRef(onTap);onTapRef.current=onTap;
//   const onSwipeRef=useRef(onSwipe);onSwipeRef.current=onSwipe;
//   const gl=useRef({x:0,y:0});

//   // touch on the board: a short touch = tap a square, a drag = swipe the board
//   const pan=useRef(PanResponder.create({
//     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
//     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
//     onPanResponderTerminationRequest:()=>false,
//     onPanResponderGrant:(e)=>{
//       gl.current={x:e.nativeEvent.locationX,y:e.nativeEvent.locationY};
//       setConfirmSkip(false);
//     },
//     onPanResponderRelease:(_e,g)=>{
//       const dist=Math.hypot(g.dx,g.dy);
//       if(dist<14){
//         const q=geo.current;
//         const col=clamp(Math.floor(gl.current.x/q.cs),0,2),row=clamp(Math.floor(gl.current.y/q.cs),0,2);
//         onTapRef.current(row*3+col);
//       }else if(dist>=26){
//         const d:Dir=Math.abs(g.dx)>Math.abs(g.dy)?(g.dx>0?'R':'L'):(g.dy>0?'D':'U');
//         onSwipeRef.current(d);
//       }
//     },
//   })).current;

//   // magnifier (search icon): costs 25 hints, shows the swipe arrow and opens the CLUES popup directly
//   const onHint=async()=>{
//     if(done)return;
//     setConfirmSkip(false);
//     setClueOpen(true);                             // clue popup opens right away, always
//     if(!sessionId||hints<25)return;                // no hints: just show the clue, skip the server call (no 402 error)
//     try{
//       const r=await hintLevel10({sessionId,playerId,board:boardRef.current});
//       setHints&&setHints(r.hints);
//       setHintDir(r.dir);
//       later(()=>setHintDir(null),6000);
//     }catch(e:any){
//       // not enough hints / network error: the clue stays visible, only the arrow is skipped
//     }
//   };

//   // video reward (+75 hints) - only adds hints, never opens the clue popup
//   const onReward=async()=>{
//     if(done)return;
//     setConfirmSkip(false);
//     try{
//       const r=await rewardLevel10(playerId);
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
//       const r=await skipLevel10({sessionId,playerId});
//       setHints&&setHints(r.hints||0);
//       doneRef.current=true;
//       onComplete?onComplete(r):onExit();
//     }catch(e:any){
//       setConfirmSkip(false);
//       flash(e.status===402?'Not enough hints':e.message||'Network error');
//     }
//   };

//   /* ---------- header (home, wooden sign, hints pill) ---------- */

//   const header=(
//     <View style={st.topBar}>
//       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
//         <Icon n="home" s={16}/>
//       </TouchableOpacity>

//       <View style={st.signWrap}>
//         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
//         <View style={st.sign}>
//           <Text style={st.signArrow}>{'<'}</Text>
//           <Text style={st.signT}>LEVEL 10</Text>
//           <Text style={st.signArrow}>{'>'}</Text>
//         </View>
//         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
//         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
//       </View>

//       <View style={st.pill}>
//         <Text style={st.pillT}>{hints}</Text>
//         <Text style={st.pillIcon}>💡</Text>
//       </View>
//     </View>
//   );

//   /* ---------- loading / error ---------- */

//   if(loadErr||!view){
//     return <Stage bg="#bddaee"><View style={st.root}>
//       <RoomBackground/>
//       {header}
//       <View style={st.centerMsg}>
//         {loadErr?<>
//           <Text style={st.err}>{loadErr}</Text>
//           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
//           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
//         </>:<>
//           <ActivityIndicator size="large" color={THEME.orange}/>
//           <Text style={st.load}>Loading level 10...</Text>
//         </>}
//       </View>
//     </View></Stage>;
//   }

//   const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
//   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

//   return <Stage bg="#bddaee"><View style={st.root}>
//     <RoomBackground/>
//     {header}

//     <View style={st.center}>
//       {/* question pill (same as level 1) */}
//       <View style={st.qPill}>
//         <Text style={st.qArrow}>{'<'}</Text>
//         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
//         <Text style={st.qArrow}>{'>'}</Text>
//       </View>

//       {/* a small chalkboard on the wall: who is who + the tic-tac-toe board */}
//       <View style={st.chalk}>
//         <View style={st.legend}>
//           <View style={st.lg}><XMark s={34}/><Text style={st.lgt}>: YOU</Text></View>
//           <View style={st.lg}><OMark s={34}/><Text style={st.lgt}>: RIVAL</Text></View>
//         </View>

//         <View style={{marginTop:8,width:BS,height:BS}}>
//           <Grid size={BS}/>

//           {pieces.map(p=>{
//             const pos=posRef.current[p.id],pp=popRef.current[p.id];
//             if(!pos||!pp)return null;
//             return <Animated.View key={p.id} pointerEvents="none"
//               style={{position:'absolute',left:0,top:0,width:cs,height:cs,alignItems:'center',justifyContent:'center',
//                 transform:[...pos.getTranslateTransform(),{scale:pp}]}}>
//               {p.kind===1?<XMark s={ms}/>:<OMark s={ms}/>}
//             </Animated.View>;
//           })}

//           {!!line&&<View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line}/></View>}

//           {/* magnifier: which way to swipe */}
//           {!!hintDir&&<View pointerEvents="none" style={[StyleSheet.absoluteFill,{alignItems:'center',justifyContent:'center'}]}>
//             <Animated.Text style={{fontSize:76,color:'#ffd33d',opacity:0.85,fontWeight:'bold',
//               transform:[{rotate:ARROW_DEG[hintDir]},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>
//           </View>}

//           <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
//         </View>
//       </View>
//     </View>

//     {/* bottom rounded panel (same as level 1) */}
//     <View style={st.panel}>
//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
//           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
//           <Icon n="film" s={36}/>
//         </TouchableOpacity>
//         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
//       </View>

//       <View style={st.btnCol}>
//         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
//           <View style={st.circleRed}><Icon n="play" s={30}/></View>
//         </TouchableOpacity>
//         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
//       </View>
//     </View>

//     {/* CLUES popup (only from the magnifier / search icon) */}
//     {clueOpen&&<View style={st.overlay}>
//       <View style={st.clueCard}>
//         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
//           <Text style={st.closeT}>✕</Text>
//         </TouchableOpacity>
//         <Text style={st.clueTitle}>CLUES</Text>

//         <View style={[st.clueRow,st.clueRowOpen]}>
//           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
//           <View style={{flex:1}}>
//             <Text style={st.clueHead}>Clue 1</Text>
//             <Text style={st.clueBody}>{CLUE_1}</Text>
//           </View>
//         </View>
//       </View>
//     </View>}

//     {/* result card */}
//     {!!result&&<View style={st.overlay}>
//       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
//         <Text style={st.cardTitle}>Level complete!</Text>
//         <Text style={st.cardMsg}>{result.message}</Text>
//         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
//         <Text style={st.cardScore}>Score {result.score}</Text>
//         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
//           <Text style={st.nextT}>NEXT</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>}
//   </View></Stage>;
// }

// /* =========================================================
//    STYLES  (same room theme as Level 1)
// ========================================================= */

// const st=StyleSheet.create({
//   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

//   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
//   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
//   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
//   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
//   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
//   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
//   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
//   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
//   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
//   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
//   pillIcon:{fontSize:16},

//   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
//   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
//   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
//   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
//   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

//   chalk:{backgroundColor:'#1f5b44',borderWidth:6,borderColor:'#d98b3d',borderRadius:14,paddingHorizontal:14,paddingTop:10,paddingBottom:14,alignItems:'center'},
//   legend:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:26},
//   lg:{flexDirection:'row',alignItems:'center',gap:4},
//   lgt:{fontFamily:FONT,fontSize:20,fontWeight:'bold',color:CHALK},

//   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
//     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
//   btnCol:{alignItems:'center'},
//   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
//   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
//   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
//   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
//   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
//   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

//   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
//   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
//   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
//   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
//   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
//   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
//   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
//   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
//   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
//   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

//   overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
//   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
//   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
//   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
//   stars:{flexDirection:'row',gap:6,marginTop:14},
//   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
//   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
//   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

//   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
//   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
//   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
//   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
//   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// });
import React,{useCallback,useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,Easing,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
import {Stage,Coin} from './BTShared';
import {Icon} from './Art';
import {BigStar} from './Btlevel7art';
import {Grid,XMark,OMark,StrikeLine} from './Btlevel10art';
import {startLevel10,hintLevel10,finishLevel10,skipLevel10,rewardLevel10,Level10View,Level10Result,Level10Action} from './Btlevel10api';
import {Board,Dir,Status,tap as playTap,tilt,tiltMoves,status as boardStatus,winLine} from './Btlevel10logic';
import {RoomBackground,THEME} from './Btlevel4Theme';

const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
const CHALK='#f6f4ea';

// clue shown in the CLUES popup when the magnifier (search icon) is tapped
const CLUE_1='Your rival is one move away from victory… can you spot the place you need to protect?';

type Props={
  playerId:number;
  hints?:number;
  setHints?:(n:number)=>void;
  onExit:()=>void;
  onComplete?:(result:Level10Result)=>void;
};

type Piece={id:number;kind:number;cell:number};

const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const ARROW_DEG:Record<Dir,string>={R:'0deg',D:'90deg',L:'180deg',U:'270deg'};

export default function BTLevel10Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
  const {width,height}=useWindowDimensions();
  const RW=Math.min(width-24,360);
  const BS=Math.floor(clamp(Math.min(RW-60,height-430),170,280));   // the tic-tac-toe board in pixels
  const cs=BS/3;                                   // one square
  const ms=cs*0.8;                                 // size of an X or an O

  const [view,setView]=useState<Level10View|null>(null);
  const [sessionId,setSessionId]=useState<number|null>(null);
  const [loadErr,setLoadErr]=useState('');
  const [msg,setMsg]=useState('');
  const [done,setDone]=useState(false);
  const [pieces,setPieces]=useState<Piece[]>([]);
  const [line,setLine]=useState<number[]|null>(null);
  const [hintDir,setHintDir]=useState<Dir|null>(null);
  const [result,setResult]=useState<Level10Result|null>(null);
  const [confirmSkip,setConfirmSkip]=useState(false);
  const [clueOpen,setClueOpen]=useState(false);
  const [clueText,setClueText]=useState(CLUE_1);   // clue text comes from the backend response

  const pop=useRef(new Animated.Value(0)).current;
  const bob=useRef(new Animated.Value(0)).current;

  const geo=useRef({cs});
  geo.current={cs};
  const boardRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);     // the board as it is now
  const initialRef=useRef<Board>([0,0,0,0,0,0,0,0,0]);   // the start board (restart goes back here)
  const actionsRef=useRef<Level10Action[]>([]);          // what the player did since the last restart
  const piecesRef=useRef<Piece[]>([]);
  const idRef=useRef(0);
  const posRef=useRef<Record<number,Animated.ValueXY>>({});
  const popRef=useRef<Record<number,Animated.Value>>({});
  const busyRef=useRef(false);
  const doneRef=useRef(false);
  const sessionRef=useRef<number|null>(null);
  const timers=useRef<any[]>([]);
  const msgTimer=useRef<any>(null);
  const later=(fn:()=>void,ms2:number)=>{timers.current.push(setTimeout(fn,ms2))};

  const flash=(m:string)=>{
    setMsg(m);clearTimeout(msgTimer.current);
    msgTimer.current=setTimeout(()=>setMsg(''),2800);
  };

  const setP=(list:Piece[])=>{piecesRef.current=list;setPieces(list)};
  const cellXY=(c:number)=>({x:(c%3)*geo.current.cs,y:Math.floor(c/3)*geo.current.cs});

  // a new X or O on the board
  const addPiece=(kind:number,cell:number)=>{
    const id=++idRef.current;
    posRef.current[id]=new Animated.ValueXY(cellXY(cell));
    popRef.current[id]=new Animated.Value(0);
    Animated.spring(popRef.current[id],{toValue:1,friction:4,tension:90,useNativeDriver:true}).start();
    setP([...piecesRef.current,{id,kind,cell}]);
  };

  // draw a whole board without animation
  const rebuild=(b:Board)=>{
    posRef.current={};popRef.current={};
    const list:Piece[]=[];
    b.forEach((v,i)=>{
      if(!v)return;
      const id=++idRef.current;
      posRef.current[id]=new Animated.ValueXY(cellXY(i));
      popRef.current[id]=new Animated.Value(1);
      list.push({id,kind:v,cell:i});
    });
    setP(list);
  };

  // 1. open the level - the backend picks a start board every time
  const load=useCallback(()=>{
    setLoadErr('');setView(null);
    startLevel10(playerId)
      .then(v=>{
        initialRef.current=v.board.slice();
        boardRef.current=v.board.slice();
        actionsRef.current=[];
        busyRef.current=false;
        doneRef.current=false;
        setDone(false);setResult(null);setLine(null);setHintDir(null);
        rebuild(v.board);
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

  // the screen size changed: put every piece on its square again
  useEffect(()=>{
    piecesRef.current.forEach(p=>{const v=posRef.current[p.id];if(v)v.setValue(cellXY(p.cell))});
  },[cs]);                                         // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    const b=Animated.loop(Animated.sequence([
      Animated.timing(bob,{toValue:1,duration:450,useNativeDriver:true}),
      Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})]));
    b.start();
    return()=>{b.stop()};
  },[]);

  useEffect(()=>{
    if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
  },[result]);

  // 2. X won: send what the player did, the backend plays it again and saves the win
  const finish=async(attempt:number)=>{
    const sid=sessionRef.current;
    if(!sid)return;
    try{
      const r=await finishLevel10({sessionId:sid,playerId,actions:actionsRef.current.slice()});
      if(setHints&&typeof r.hints==='number')setHints(r.hints);
      setDone(true);
      later(()=>setResult(r),1300);
    }catch(e:any){
      if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
      doneRef.current=false;
      flash(e.message||'Network error. Try again.');
      later(restart,1600);
    }
  };
  const finishRef=useRef(finish);
  finishRef.current=finish;

  // go back to the start board
  const restart=()=>{
    boardRef.current=initialRef.current.slice();
    actionsRef.current=[];
    setLine(null);setHintDir(null);
    rebuild(boardRef.current);
    busyRef.current=false;
  };

  // what happens after a move
  const settle=(s:Status)=>{
    if(s==='play'){busyRef.current=false;return}
    if(s==='win'){
      doneRef.current=true;
      setConfirmSkip(false);
      setLine(winLine(boardRef.current,1));
      finishRef.current(0);
      return;
    }
    flash(s==='lose'?'The rival wins! Try again...':'A draw is not a win! Try again...');
    later(restart,1700);
  };

  // tap a square: X goes there and the rival answers
  const onTap=(c:number)=>{
    if(busyRef.current||doneRef.current)return;
    const b=boardRef.current;
    if(b[c]!==0){flash('That square is taken!');return}
    busyRef.current=true;
    setHintDir(null);
    actionsRef.current.push({t:'tap',c});
    const r=playTap(b,c);
    boardRef.current=r.board;
    addPiece(1,c);
    if(r.rival>=0)later(()=>addPiece(2,r.rival),380);
    later(()=>settle(r.status),r.rival>=0?900:450);
  };

  // swipe the board: every piece slides to that side
  const onSwipe=(d:Dir)=>{
    if(busyRef.current||doneRef.current)return;
    const b=boardRef.current;
    const moves=tiltMoves(b,d);
    if(!moves.some(m=>m.from!==m.to)){flash('Nothing can slide that way');return}
    busyRef.current=true;
    setHintDir(null);
    actionsRef.current.push({t:'swipe',d});
    const nb=tilt(b,d);
    boardRef.current=nb;

    const to:Record<number,number>={};
    const anims:Animated.CompositeAnimation[]=[];
    moves.forEach(m=>{
      to[m.from]=m.to;
      if(m.from===m.to)return;
      const pc=piecesRef.current.find(p=>p.cell===m.from);
      const v=pc&&posRef.current[pc.id];
      if(v)anims.push(Animated.timing(v,{toValue:cellXY(m.to),duration:340,easing:Easing.out(Easing.cubic),useNativeDriver:true}));
    });
    Animated.parallel(anims).start(()=>{
      setP(piecesRef.current.map(p=>({...p,cell:to[p.cell]!==undefined?to[p.cell]:p.cell})));
      settle(boardStatus(nb));
    });
  };

  const onTapRef=useRef(onTap);onTapRef.current=onTap;
  const onSwipeRef=useRef(onSwipe);onSwipeRef.current=onSwipe;
  const gl=useRef({x:0,y:0});

  // touch on the board: a short touch = tap a square, a drag = swipe the board
  const pan=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
    onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
    onPanResponderTerminationRequest:()=>false,
    onPanResponderGrant:(e)=>{
      gl.current={x:e.nativeEvent.locationX,y:e.nativeEvent.locationY};
      setConfirmSkip(false);
    },
    onPanResponderRelease:(_e,g)=>{
      const dist=Math.hypot(g.dx,g.dy);
      if(dist<14){
        const q=geo.current;
        const col=clamp(Math.floor(gl.current.x/q.cs),0,2),row=clamp(Math.floor(gl.current.y/q.cs),0,2);
        onTapRef.current(row*3+col);
      }else if(dist>=26){
        const d:Dir=Math.abs(g.dx)>Math.abs(g.dy)?(g.dx>0?'R':'L'):(g.dy>0?'D':'U');
        onSwipeRef.current(d);
      }
    },
  })).current;

  // magnifier (search icon): frontend -> POST /hint -> backend saves it in the database -> JSON back -> popup opens
  const onHint=async()=>{
    if(done||!sessionId)return;
    setConfirmSkip(false);
    try{
      const r=await hintLevel10({sessionId,playerId,board:boardRef.current});
      if(typeof r.hints==='number'&&setHints)setHints(r.hints);
      setClueText(r.clue||CLUE_1);
      if(r.dir){
        setHintDir(r.dir);
        later(()=>setHintDir(null),6000);
      }
      setClueOpen(true);
    }catch(e:any){
      // backend refused (for example not enough hints) or network problem
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  // video reward (+75 hints) - only adds hints, never opens the clue popup
  const onReward=async()=>{
    if(done)return;
    setConfirmSkip(false);
    try{
      const r=await rewardLevel10(playerId);
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
      const r=await skipLevel10({sessionId,playerId});
      setHints&&setHints(r.hints||0);
      doneRef.current=true;
      onComplete?onComplete(r):onExit();
    }catch(e:any){
      setConfirmSkip(false);
      flash(e.status===402?'Not enough hints':e.message||'Network error');
    }
  };

  /* ---------- header (home, wooden sign, hints pill) ---------- */

  const header=(
    <View style={st.topBar}>
      <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
        <Icon n="home" s={16}/>
      </TouchableOpacity>

      <View style={st.signWrap}>
        <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
        <View style={st.sign}>
          <Text style={st.signArrow}>{'<'}</Text>
          <Text style={st.signT}>LEVEL 10</Text>
          <Text style={st.signArrow}>{'>'}</Text>
        </View>
        <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
        <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
      </View>

      <View style={st.pill}>
        <Text style={st.pillT}>{hints}</Text>
        <Text style={st.pillIcon}>💡</Text>
      </View>
    </View>
  );

  /* ---------- loading / error ---------- */

  if(loadErr||!view){
    return <Stage bg="#bddaee"><View style={st.root}>
      <RoomBackground/>
      {header}
      <View style={st.centerMsg}>
        {loadErr?<>
          <Text style={st.err}>{loadErr}</Text>
          <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
          <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
        </>:<>
          <ActivityIndicator size="large" color={THEME.orange}/>
          <Text style={st.load}>Loading level 10...</Text>
        </>}
      </View>
    </View></Stage>;
  }

  const bobX=bob.interpolate({inputRange:[0,1],outputRange:[-6,6]});
  const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'pointer'}:{};

  return <Stage bg="#bddaee"><View style={st.root}>
    <RoomBackground/>
    {header}

    <View style={st.center}>
      {/* question pill (same as level 1) */}
      <View style={st.qPill}>
        <Text style={st.qArrow}>{'<'}</Text>
        <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
        <Text style={st.qArrow}>{'>'}</Text>
      </View>

      {/* a small chalkboard on the wall: who is who + the tic-tac-toe board */}
      <View style={st.chalk}>
        <View style={st.legend}>
          <View style={st.lg}><XMark s={34}/><Text style={st.lgt}>: YOU</Text></View>
          <View style={st.lg}><OMark s={34}/><Text style={st.lgt}>: RIVAL</Text></View>
        </View>

        <View style={{marginTop:8,width:BS,height:BS}}>
          <Grid size={BS}/>

          {pieces.map(p=>{
            const pos=posRef.current[p.id],pp=popRef.current[p.id];
            if(!pos||!pp)return null;
            return <Animated.View key={p.id} pointerEvents="none"
              style={{position:'absolute',left:0,top:0,width:cs,height:cs,alignItems:'center',justifyContent:'center',
                transform:[...pos.getTranslateTransform(),{scale:pp}]}}>
              {p.kind===1?<XMark s={ms}/>:<OMark s={ms}/>}
            </Animated.View>;
          })}

          {!!line&&<View pointerEvents="none" style={StyleSheet.absoluteFill}><StrikeLine size={BS} cells={line}/></View>}

          {/* magnifier: which way to swipe */}
          {!!hintDir&&<View pointerEvents="none" style={[StyleSheet.absoluteFill,{alignItems:'center',justifyContent:'center'}]}>
            <Animated.Text style={{fontSize:76,color:'#ffd33d',opacity:0.85,fontWeight:'bold',
              transform:[{rotate:ARROW_DEG[hintDir]},{translateX:bobX}]}}>{'\u279C'}</Animated.Text>
          </View>}

          <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
        </View>
      </View>
    </View>

    {/* bottom rounded panel (same as level 1) */}
    <View style={st.panel}>
      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
          <View style={st.circleGreen}><Icon n="search" s={32}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
          <Icon n="film" s={36}/>
        </TouchableOpacity>
        <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
      </View>

      <View style={st.btnCol}>
        <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
          <View style={st.circleRed}><Icon n="play" s={30}/></View>
        </TouchableOpacity>
        <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
      </View>
    </View>

    {/* CLUES popup (only from the magnifier / search icon) */}
    {clueOpen&&<View style={st.overlay}>
      <View style={st.clueCard}>
        <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
          <Text style={st.closeT}>✕</Text>
        </TouchableOpacity>
        <Text style={st.clueTitle}>CLUES</Text>

        <View style={[st.clueRow,st.clueRowOpen]}>
          <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
          <View style={{flex:1}}>
            <Text style={st.clueHead}>Clue 1</Text>
            <Text style={st.clueBody}>{clueText}</Text>
          </View>
        </View>
      </View>
    </View>}

    {/* result card */}
    {!!result&&<View style={st.overlay}>
      <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
        <Text style={st.cardTitle}>Level complete!</Text>
        <Text style={st.cardMsg}>{result.message}</Text>
        <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
        <Text style={st.cardScore}>Score {result.score}</Text>
        <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
          <Text style={st.nextT}>NEXT</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>}
  </View></Stage>;
}

/* =========================================================
   STYLES  (same room theme as Level 1)
========================================================= */

const st=StyleSheet.create({
  root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

  topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
  homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
  signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
  string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
  sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
  signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
  signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
  leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
  pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
  pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
  pillIcon:{fontSize:16},

  center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
  centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
  qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
  qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
  q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},

  chalk:{backgroundColor:'#1f5b44',borderWidth:6,borderColor:'#d98b3d',borderRadius:14,paddingHorizontal:14,paddingTop:10,paddingBottom:14,alignItems:'center'},
  legend:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:26},
  lg:{flexDirection:'row',alignItems:'center',gap:4},
  lgt:{fontFamily:FONT,fontSize:20,fontWeight:'bold',color:CHALK},

  panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
    flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
  btnCol:{alignItems:'center'},
  ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
  circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
  ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
  circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
  badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
  badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

  clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:10},
  clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
  closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
  closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
  clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
  clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
  clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
  clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
  clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
  clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},

  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
  card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
  cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
  cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
  stars:{flexDirection:'row',gap:6,marginTop:14},
  cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
  next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
  nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

  load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
  err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
  retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
  retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
  back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
});
