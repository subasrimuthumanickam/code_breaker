
// // // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // // // import {Stage,Coin} from './BTShared';
// // // // // import {Icon} from './Art';
// // // // // import {BigStar} from './Btlevel7art';
// // // // // import {Maze,Dog,Bone,DogHouse,OPEN_N,OPEN_E,OPEN_S,OPEN_W} from './Btlevel9art';
// // // // // import {startLevel9,hintLevel9,finishLevel9,skipLevel9,rewardLevel9,Level9View,Level9Result} from './Btlevel9api';
// // // // // import {RoomBackground,THEME} from './Btlevel4Theme';

// // // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});

// // // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // // const CLUE_1='The shortest route isn’t always obvious… guide your furry friend to the place where you feel at home.';

// // // // // type Props={
// // // // //   playerId:number;
// // // // //   hints?:number;
// // // // //   setHints?:(n:number)=>void;
// // // // //   onExit:()=>void;
// // // // //   onComplete?:(result:Level9Result)=>void;
// // // // // };

// // // // // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// // // // // const PADC=1.3;                                    // free board around the maze, in cells
// // // // // const DPAD_H=96;                                   // height of the arrow buttons block

// // // // // export default function BTLevel9Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // // //   const {width,height}=useWindowDimensions();
// // // // //   const RW=Math.min(width-24,360);                 // field width limit
// // // // //   const IW=RW;

// // // // //   const [view,setView]=useState<Level9View|null>(null);
// // // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // // //   const [loadErr,setLoadErr]=useState('');
// // // // //   const [msg,setMsg]=useState('');
// // // // //   const [done,setDone]=useState(false);
// // // // //   const [trail,setTrail]=useState<number[]>([]);
// // // // //   const [hintCells,setHintCells]=useState<number[]>([]);
// // // // //   const [result,setResult]=useState<Level9Result|null>(null);
// // // // //   const [confirmSkip,setConfirmSkip]=useState(false);
// // // // //   const [clueOpen,setClueOpen]=useState(false);

// // // // //   const cols=view?view.cols:9;
// // // // //   const rows=view?view.rows:9;
// // // // //   const cs=Math.max(20,Math.floor(Math.min(IW/(cols+2*PADC),(height-350-(DPAD_H+6))/(rows+2*PADC))));   // one cell in pixels
// // // // //   const ds=cs*0.9;                                                          // dog size
// // // // //   const pad=cs*PADC;                                                        // board around the maze
// // // // //   const FW=cols*cs+2*pad;                                                   // whole drag field
// // // // //   const FH=rows*cs+2*pad;

// // // // //   const dogPos=useRef(new Animated.ValueXY()).current;
// // // // //   const hop=useRef(new Animated.Value(0)).current;
// // // // //   const pop=useRef(new Animated.Value(0)).current;

// // // // //   const geo=useRef({cs,cols,rows,ds,pad,FW,FH});
// // // // //   geo.current={cs,cols,rows,ds,pad,FW,FH};
// // // // //   const startRef=useRef(0);
// // // // //   const outsideRef=useRef(false);                  // the dog is on the board, outside the maze
// // // // //   const cellsRef=useRef<number[]>([]);
// // // // //   const goalRef=useRef(0);
// // // // //   const curRef=useRef(0);                          // the cell the dog stands on
// // // // //   const pathRef=useRef<number[]>([0]);             // start -> bone (free drag)
// // // // //   const dogC=useRef({x:0,y:0});                    // dog centre in maze pixels
// // // // //   const touch=useRef({on:false,sx:0,sy:0});        // drag state
// // // // //   const doneRef=useRef(false);
// // // // //   const sessionRef=useRef<number|null>(null);
// // // // //   const timers=useRef<any[]>([]);
// // // // //   const msgTimer=useRef<any>(null);
// // // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // // //   const flash=(m:string)=>{
// // // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // // //   };

// // // // //   // put the dog (by its centre) at a pixel of the maze
// // // // //   const moveDogTo=(x:number,y:number)=>{
// // // // //     const q=geo.current;
// // // // //     dogC.current={x,y};
// // // // //     dogPos.setValue({x:x-q.ds/2,y:y-q.ds/2});
// // // // //   };

// // // // //   // centre pixel of a cell
// // // // //   const centreOf=(c:number)=>{
// // // // //     const g=geo.current;
// // // // //     return {x:g.pad+(c%g.cols+0.5)*g.cs,y:g.pad+(Math.floor(c/g.cols)+0.5)*g.cs};
// // // // //   };

// // // // //   // 1. open the level - the backend builds a NEW maze every time
// // // // //   const load=useCallback(()=>{
// // // // //     setLoadErr('');setView(null);
// // // // //     startLevel9(playerId)
// // // // //       .then(v=>{
// // // // //         cellsRef.current=v.cells;
// // // // //         goalRef.current=v.goal;
// // // // //         curRef.current=v.start;
// // // // //         pathRef.current=[v.start];
// // // // //         doneRef.current=false;
// // // // //         touch.current={on:false,sx:0,sy:0};
// // // // //         startRef.current=v.start;
// // // // //         outsideRef.current=false;
// // // // //         const g=geo.current;
// // // // //         dogC.current={x:g.pad+(v.start%v.cols+0.5)*g.cs,y:g.pad+(Math.floor(v.start/v.cols)+0.5)*g.cs};
// // // // //         setDone(false);setResult(null);setHintCells([]);setTrail([v.start]);
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

// // // // //   // when the maze appears or the size changes, keep the dog on the same spot (scaled)
// // // // //   const lastCs=useRef(cs);
// // // // //   useEffect(()=>{
// // // // //     if(!view)return;
// // // // //     if(lastCs.current!==cs){
// // // // //       const k=cs/lastCs.current;
// // // // //       dogC.current={x:dogC.current.x*k,y:dogC.current.y*k};
// // // // //       lastCs.current=cs;
// // // // //     }
// // // // //     moveDogTo(dogC.current.x,dogC.current.y);
// // // // //   },[view,cs]);                                    // eslint-disable-line react-hooks/exhaustive-deps

// // // // //   useEffect(()=>{
// // // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // // //   },[result]);

// // // // //   // 2. the dog reached the bone: tell the backend, it saves the win
// // // // //   const finish=async(attempt:number)=>{
// // // // //     const sid=sessionRef.current;
// // // // //     if(!sid)return;
// // // // //     try{
// // // // //       const path=pathRef.current.slice();
// // // // //       const r=await finishLevel9({sessionId:sid,playerId,path,moves:Math.max(1,path.length-1)});
// // // // //       if(setHints&&typeof r.hints==='number')setHints(r.hints);
// // // // //       setDone(true);
// // // // //       Animated.sequence([
// // // // //         Animated.timing(hop,{toValue:-14,duration:160,useNativeDriver:true}),
// // // // //         Animated.timing(hop,{toValue:0,duration:160,useNativeDriver:true}),
// // // // //         Animated.timing(hop,{toValue:-10,duration:140,useNativeDriver:true}),
// // // // //         Animated.timing(hop,{toValue:0,duration:140,useNativeDriver:true}),
// // // // //       ]).start();
// // // // //       later(()=>setResult(r),1300);
// // // // //     }catch(e:any){
// // // // //       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
// // // // //       doneRef.current=false;
// // // // //       flash(e.message||'Network error. Move the dog a little and come back.');
// // // // //     }
// // // // //   };
// // // // //   const finishRef=useRef(finish);
// // // // //   finishRef.current=finish;

// // // // //   // which maze cell is under a pixel of the field (-1 = on the board outside the maze)
// // // // //   const cellAt=(x:number,y:number)=>{
// // // // //     const q=geo.current;
// // // // //     const mx=x-q.pad,my=y-q.pad;
// // // // //     if(mx<0||my<0||mx>=q.cols*q.cs||my>=q.rows*q.cs)return -1;
// // // // //     return Math.floor(my/q.cs)*q.cols+Math.floor(mx/q.cs);
// // // // //   };

// // // // //   // can the dog step from (ox,oy) to (nx,ny)?
// // // // //   //  - inside the maze: only through open sides (walls block the dog)
// // // // //   //  - outside the maze: free, but it cannot cut through the maze walls
// // // // //   //  - the only gates: top of the start cell and bottom of the goal cell
// // // // //   const stand=(ox:number,oy:number,nx:number,ny:number)=>{
// // // // //     const q=geo.current,cells=cellsRef.current;
// // // // //     if(nx<q.ds/2||nx>q.FW-q.ds/2||ny<q.ds/2||ny>q.FH-q.ds/2)return false;
// // // // //     const mx0=q.pad,my0=q.pad,mx1=q.pad+q.cols*q.cs,my1=q.pad+q.rows*q.cs;
// // // // //     const oc=cellAt(ox,oy),nc=cellAt(nx,ny);

// // // // //     if(oc>=0&&nc>=0){                                       // inside -> inside
// // // // //       if(oc===nc)return true;
// // // // //       const dx=(nc%q.cols)-(oc%q.cols),dy=Math.floor(nc/q.cols)-Math.floor(oc/q.cols);
// // // // //       if(Math.abs(dx)+Math.abs(dy)!==1)return false;
// // // // //       const bit=dx>0?OPEN_E:dx<0?OPEN_W:dy>0?OPEN_S:OPEN_N;
// // // // //       return !!(cells[oc]&bit);
// // // // //     }
// // // // //     if(oc<0&&nc<0){                                         // outside -> outside
// // // // //       const B=q.ds*0.5;                                     // keep the dog off the outer wall
// // // // //       const near=nx>mx0-B&&nx<mx1+B&&ny>my0-B&&ny<my1+B;
// // // // //       if(!near)return true;
// // // // //       const startGate=nx>=mx0&&nx<mx0+q.cs&&ny<my0;
// // // // //       const goalGate=nx>=mx1-q.cs&&nx<mx1&&ny>=my1;
// // // // //       return startGate||goalGate;
// // // // //     }
// // // // //     if(oc<0){                                               // outside -> inside
// // // // //       if(nc===startRef.current&&oy<my0)return true;
// // // // //       if(nc===goalRef.current&&oy>=my1)return true;
// // // // //       return false;
// // // // //     }
// // // // //     if(oc===startRef.current&&ny<my0)return true;           // inside -> outside
// // // // //     if(oc===goalRef.current&&ny>=my1)return true;
// // // // //     return false;
// // // // //   };

// // // // //   // common logic after the dog moved (drag AND arrow buttons)
// // // // //   const afterMove=(x:number,y:number)=>{
// // // // //     const q=geo.current;
// // // // //     moveDogTo(x,y);

// // // // //     const cell=cellAt(x,y);
// // // // //     outsideRef.current=cell<0;
// // // // //     if(cell>=0&&cell!==curRef.current){
// // // // //       curRef.current=cell;
// // // // //       const p=pathRef.current;
// // // // //       if(p.length>1&&p[p.length-2]===cell)p.pop();else p.push(cell);
// // // // //       setTrail(p.slice());
// // // // //     }

// // // // //     // win: the dog reaches the bone. From the board outside, getting close to the bone house is enough.
// // // // //     // Inside the maze the goal is walled off, so the only way to win is the outside way.
// // // // //     const gp=centreOf(goalRef.current);
// // // // //     const nearBone=cell<0&&Math.hypot(x-gp.x,y-gp.y)<=q.cs*1.4;
// // // // //     if(nearBone||(cell>=0&&cell===goalRef.current)){
// // // // //       doneRef.current=true;
// // // // //       touch.current.on=false;
// // // // //       setConfirmSkip(false);
// // // // //       moveDogTo(gp.x,gp.y);                               // snap to the bone
// // // // //       finishRef.current(0);
// // // // //     }
// // // // //   };

// // // // //   // arrow buttons: one cell per tap (inside the maze), half a cell (outside on the board)
// // // // //   const step=(dir:'U'|'D'|'L'|'R')=>{
// // // // //     if(doneRef.current||!sessionRef.current)return;
// // // // //     setConfirmSkip(false);
// // // // //     const q=geo.current,d=dogC.current;
// // // // //     const dx=dir==='L'?-1:dir==='R'?1:0,dy=dir==='U'?-1:dir==='D'?1:0;
// // // // //     const oc=cellAt(d.x,d.y);
// // // // //     let tx:number,ty:number;
// // // // //     if(oc>=0){const c=centreOf(oc);tx=c.x+dx*q.cs;ty=c.y+dy*q.cs}
// // // // //     else{tx=d.x+dx*q.cs*0.5;ty=d.y+dy*q.cs*0.5}
// // // // //     let x=d.x,y=d.y;
// // // // //     const n=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/(q.cs/6)));
// // // // //     const sx=(tx-x)/n,sy=(ty-y)/n;
// // // // //     for(let i=0;i<n;i+=1){
// // // // //       if(stand(x,y,x+sx,y+sy)){x+=sx;y+=sy}
// // // // //       else if(oc<0&&stand(x,y,x+sx,y)){x+=sx}
// // // // //       else if(oc<0&&stand(x,y,x,y+sy)){y+=sy}
// // // // //       else break;
// // // // //     }
// // // // //     if(oc>=0&&Math.hypot(tx-x,ty-y)>1)return;   // wall blocked
// // // // //     if(x===d.x&&y===d.y)return;
// // // // //     afterMove(x,y);
// // // // //   };

// // // // //   // grab the dog and drag it. Walls block it inside the maze, so the way to the bone is OUTSIDE.
// // // // //   const pan=useRef(PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // // //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // // //     onPanResponderTerminationRequest:()=>false,
// // // // //     onPanResponderGrant:(e)=>{
// // // // //       const q=geo.current,c=dogC.current;
// // // // //       const d=Math.hypot(e.nativeEvent.locationX-c.x,e.nativeEvent.locationY-c.y);
// // // // //       touch.current={on:d<=q.cs*1.1,sx:c.x,sy:c.y};         // touch must start on the dog
// // // // //       setConfirmSkip(false);
// // // // //     },
// // // // //     onPanResponderMove:(_e,g)=>{
// // // // //       const t=touch.current;
// // // // //       if(doneRef.current||!t.on)return;
// // // // //       const q=geo.current,d=dogC.current;

// // // // //       // where the finger wants the dog (the finger never runs more than ~1 cell ahead of a blocked dog)
// // // // //       let tx=t.sx+g.dx,ty=t.sy+g.dy;
// // // // //       const ox=tx-d.x,oy=ty-d.y,len=Math.hypot(ox,oy),lim=q.cs*1.2;
// // // // //       if(len>lim){const k=(len-lim)/len;t.sx-=ox*k;t.sy-=oy*k;tx-=ox*k;ty-=oy*k}

// // // // //       // walk in small steps so a fast swipe cannot jump over a wall; slide along walls
// // // // //       let x=d.x,y=d.y;
// // // // //       const n=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/(q.cs/6)));
// // // // //       const sx=(tx-x)/n,sy=(ty-y)/n;
// // // // //       for(let i=0;i<n;i+=1){
// // // // //         if(stand(x,y,x+sx,y+sy)){x+=sx;y+=sy}
// // // // //         else if(stand(x,y,x+sx,y)){x+=sx}
// // // // //         else if(stand(x,y,x,y+sy)){y+=sy}
// // // // //       }
// // // // //       if(x===d.x&&y===d.y)return;
// // // // //       afterMove(x,y);
// // // // //     },
// // // // //     onPanResponderRelease:()=>{touch.current.on=false},
// // // // //     onPanResponderTerminate:()=>{touch.current.on=false},
// // // // //   })).current;

// // // // //   // magnifier: inside the maze the server shows the way back to the exit (25 hints).
// // // // //   // Then the CLUES popup opens. On the outside board it is free.
// // // // //   const onHint=async()=>{
// // // // //     if(done||!sessionId)return;
// // // // //     setConfirmSkip(false);
// // // // //     if(outsideRef.current){setClueOpen(true);return}   // free tip
// // // // //     try{
// // // // //       const r=await hintLevel9({sessionId,playerId,cell:curRef.current});
// // // // //       setHints&&setHints(r.hints);
// // // // //       setHintCells(r.path);
// // // // //       later(()=>setHintCells([]),6000);
// // // // //       setClueOpen(true);
// // // // //     }catch(e:any){
// // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // //     }
// // // // //   };

// // // // //   // video reward (+75 hints)
// // // // //   const onReward=async()=>{
// // // // //     if(done)return;
// // // // //     setConfirmSkip(false);
// // // // //     try{
// // // // //       const r=await rewardLevel9(playerId);
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
// // // // //       const r=await skipLevel9({sessionId,playerId});
// // // // //       setHints&&setHints(r.hints||0);
// // // // //       doneRef.current=true;
// // // // //       onComplete?onComplete(r):onExit();
// // // // //     }catch(e:any){
// // // // //       setConfirmSkip(false);
// // // // //       flash(e.status===402?'Not enough hints':e.message||'Network error');
// // // // //     }
// // // // //   };

// // // // //   /* ---------- header (home, wooden sign, hints pill) ---------- */

// // // // //   const header=(
// // // // //     <View style={st.topBar}>
// // // // //       <TouchableOpacity style={st.homeBtn} activeOpacity={0.85} onPress={onExit}>
// // // // //         <Icon n="home" s={16}/>
// // // // //       </TouchableOpacity>

// // // // //       <View style={st.signWrap}>
// // // // //         <View style={[st.string,{left:22}]}/><View style={[st.string,{right:22}]}/>
// // // // //         <View style={st.sign}>
// // // // //           <Text style={st.signArrow}>{'<'}</Text>
// // // // //           <Text style={st.signT}>LEVEL 9</Text>
// // // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // // //         </View>
// // // // //         <View style={[st.leaf,{left:-6,transform:[{rotate:'-30deg'}]}]}/>
// // // // //         <View style={[st.leaf,{right:-6,transform:[{rotate:'30deg'}]}]}/>
// // // // //       </View>

// // // // //       <View style={st.pill}>
// // // // //         <Text style={st.pillT}>{hints}</Text>
// // // // //         <Text style={st.pillIcon}>💡</Text>
// // // // //       </View>
// // // // //     </View>
// // // // //   );

// // // // //   /* ---------- loading / error ---------- */

// // // // //   if(loadErr||!view){
// // // // //     return <Stage bg="#bddaee"><View style={st.root}>
// // // // //       <RoomBackground/>
// // // // //       {header}
// // // // //       <View style={st.centerMsg}>
// // // // //         {loadErr?<>
// // // // //           <Text style={st.err}>{loadErr}</Text>
// // // // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // // //         </>:<>
// // // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // // //           <Text style={st.load}>Loading level 9...</Text>
// // // // //         </>}
// // // // //       </View>
// // // // //     </View></Stage>;
// // // // //   }

// // // // //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
// // // // //   const gx=pad+(view.goal%cols)*cs,gy=pad+Math.floor(view.goal/cols)*cs;

// // // // //   return <Stage bg="#bddaee"><View style={st.root}>
// // // // //     <RoomBackground/>
// // // // //     {header}

// // // // //     <View style={st.center}>
// // // // //       {/* question pill (same as level 1) */}
// // // // //       <View style={st.qPill}>
// // // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // // //       </View>

// // // // //       {/* the maze: drag the dog to the bone */}
// // // // //       <View style={[st.field,{width:FW,height:FH}]}>
// // // // //         {/* the maze sits in the middle, the board around it is free to walk on */}
// // // // //         <View style={{position:'absolute',left:pad,top:pad,width:cols*cs,height:rows*cs}}>
// // // // //           <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal}/>
// // // // //         </View>

// // // // //         {/* dog house + bone at the goal */}
// // // // //         <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.02,top:gy+cs*0.02}}><DogHouse w={cs*0.96}/></View>
// // // // //         <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.06,top:gy+cs*0.66}}><Bone w={cs*0.8}/></View>

// // // // //         {/* the dog */}
// // // // //         <Animated.View pointerEvents="none"
// // // // //           style={{position:'absolute',left:0,top:0,transform:[...dogPos.getTranslateTransform(),{translateY:hop}]}}>
// // // // //           <Dog w={ds}/>
// // // // //         </Animated.View>

// // // // //         <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// // // // //       </View>

// // // // //       {/* arrow buttons (below the maze) */}
// // // // //       <View style={st.dpad}>
// // // // //         <TouchableOpacity style={[st.arrow,{left:48,top:0}]} activeOpacity={0.8} onPress={()=>step('U')}><Text style={st.arrowT}>▲</Text></TouchableOpacity>
// // // // //         <TouchableOpacity style={[st.arrow,{left:0,top:26}]} activeOpacity={0.8} onPress={()=>step('L')}><Text style={st.arrowT}>◀</Text></TouchableOpacity>
// // // // //         <TouchableOpacity style={[st.arrow,{left:96,top:26}]} activeOpacity={0.8} onPress={()=>step('R')}><Text style={st.arrowT}>▶</Text></TouchableOpacity>
// // // // //         <TouchableOpacity style={[st.arrow,{left:48,top:52}]} activeOpacity={0.8} onPress={()=>step('D')}><Text style={st.arrowT}>▼</Text></TouchableOpacity>
// // // // //       </View>
// // // // //     </View>

// // // // //     {/* bottom rounded panel (same as level 1) */}
// // // // //     <View style={st.panel}>
// // // // //       <View style={st.btnCol}>
// // // // //         <TouchableOpacity style={st.ringGreen} activeOpacity={0.85} onPress={onHint}>
// // // // //           <View style={st.circleGreen}><Icon n="search" s={32}/></View>
// // // // //         </TouchableOpacity>
// // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>25</Text></View>
// // // // //       </View>

// // // // //       <View style={st.btnCol}>
// // // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onReward}>
// // // // //           <Icon n="film" s={36}/>
// // // // //         </TouchableOpacity>
// // // // //         <View style={st.badge}><Coin s={12}/><Text style={st.badgeT}>+75</Text></View>
// // // // //       </View>

// // // // //       <View style={st.btnCol}>
// // // // //         <TouchableOpacity style={st.ringWhite} activeOpacity={0.85} onPress={onSkip}>
// // // // //           <View style={st.circleRed}><Icon n="play" s={30}/></View>
// // // // //         </TouchableOpacity>
// // // // //         <View style={st.badge}><Icon n="bulb" s={13}/><Text style={st.badgeT}>50</Text></View>
// // // // //       </View>
// // // // //     </View>

// // // // //     {/* CLUES popup (only from the magnifier) */}
// // // // //     {clueOpen&&<View style={st.overlay}>
// // // // //       <View style={st.clueCard}>
// // // // //         <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={()=>setClueOpen(false)}>
// // // // //           <Text style={st.closeT}>✕</Text>
// // // // //         </TouchableOpacity>
// // // // //         <Text style={st.clueTitle}>CLUES</Text>

// // // // //         <View style={[st.clueRow,st.clueRowOpen]}>
// // // // //           <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// // // // //           <View style={{flex:1}}>
// // // // //             <Text style={st.clueHead}>Clue 1</Text>
// // // // //             <Text style={st.clueBody}>{CLUE_1}</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //       </View>
// // // // //     </View>}

// // // // //     {/* result card */}
// // // // //     {!!result&&<View style={st.overlay}>
// // // // //       <Animated.View style={[st.card,{opacity:pop,transform:[{scale:pop.interpolate({inputRange:[0,1],outputRange:[0.6,1]})}]}]}>
// // // // //         <Text style={st.cardTitle}>Level complete!</Text>
// // // // //         <Text style={st.cardMsg}>{result.message}</Text>
// // // // //         <View style={st.stars}>{[1,2,3].map(n=><BigStar key={n} s={46} on={n<=(result.stars||0)}/>)}</View>
// // // // //         <Text style={st.cardScore}>Score {result.score}</Text>
// // // // //         <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={()=>onComplete?onComplete(result):onExit()}>
// // // // //           <Text style={st.nextT}>NEXT</Text>
// // // // //         </TouchableOpacity>
// // // // //       </Animated.View>
// // // // //     </View>}
// // // // //   </View></Stage>;
// // // // // }

// // // // // /* =========================================================
// // // // //    STYLES  (same room theme as Level 1)
// // // // // ========================================================= */

// // // // // const st=StyleSheet.create({
// // // // //   root:{flex:1,backgroundColor:'#bddaee',overflow:'hidden'},

// // // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // // //   homeBtn:{width:40,height:40,borderRadius:20,backgroundColor:THEME.yellow,borderWidth:2.5,borderColor:THEME.yellowBorder,alignItems:'center',justifyContent:'center'},
// // // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // // //   string:{position:'absolute',top:0,width:2,height:14,backgroundColor:'#7a5a3a'},
// // // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:44,borderRadius:8,backgroundColor:THEME.wood,borderWidth:3,borderColor:THEME.woodDark},
// // // // //   signT:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:THEME.cream,letterSpacing:1},
// // // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // // //   leaf:{position:'absolute',top:4,width:22,height:12,borderRadius:8,backgroundColor:'#6cbf4a'},
// // // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:34,minWidth:64,justifyContent:'center',paddingHorizontal:12,borderRadius:17,backgroundColor:'#fff'},
// // // // //   pillT:{fontFamily:FONT,fontSize:18,fontWeight:'900',color:'#1b1b1b'},
// // // // //   pillIcon:{fontSize:16},

// // // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:THEME.cream,borderRadius:24,paddingVertical:8,paddingHorizontal:16,marginBottom:10,maxWidth:360},
// // // // //   qArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:THEME.orange},
// // // // //   q:{flexShrink:1,fontFamily:FONT,fontSize:17,fontStyle:'italic',color:THEME.navy,textAlign:'center'},
// // // // //   field:{backgroundColor:'#a6dd63',borderRadius:12,borderWidth:0},

// // // // //   dpad:{width:140,height:DPAD_H,marginTop:6},
// // // // //   arrow:{position:'absolute',width:44,height:44,borderRadius:22,backgroundColor:'#3bb0d0',borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // // // //   arrowT:{fontSize:20,color:'#1b1b1b',fontWeight:'900'},

// // // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:56,backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,
// // // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // // //   btnCol:{alignItems:'center'},
// // // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:THEME.green,alignItems:'center',justifyContent:'center'},
// // // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:22,borderRadius:11,backgroundColor:THEME.badge},
// // // // //   badgeT:{fontFamily:FONT,fontSize:13,fontWeight:'900',color:'#fff'},

// // // // //   clueCard:{width:'86%',maxWidth:360,backgroundColor:'#f9efdf',borderColor:'#e8912e',borderWidth:6,borderRadius:28,paddingHorizontal:18,paddingTop:18,paddingBottom:22},
// // // // //   clueTitle:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:THEME.navy,textAlign:'center',marginBottom:14},
// // // // //   closeBtn:{position:'absolute',top:-4,right:-4,width:38,height:38,borderRadius:19,backgroundColor:THEME.yellow,borderWidth:3,borderColor:'#e8912e',alignItems:'center',justifyContent:'center',zIndex:2},
// // // // //   closeT:{fontSize:18,fontWeight:'900',color:'#ee4558'},
// // // // //   clueRow:{flexDirection:'row',alignItems:'center',gap:14,borderRadius:22,borderWidth:2.5,paddingVertical:14,paddingHorizontal:14,marginBottom:12},
// // // // //   clueRowOpen:{backgroundColor:'#fff',borderColor:'#3ec45a'},
// // // // //   clueRowLocked:{backgroundColor:'#f8e3ae',borderColor:'#f3b73a'},
// // // // //   clueNum:{width:52,height:52,borderRadius:26,backgroundColor:'#c0702b',alignItems:'center',justifyContent:'center'},
// // // // //   clueNumT:{fontFamily:FONT,fontSize:28,fontWeight:'900',color:'#fff'},
// // // // //   clueHead:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#c0702b'},
// // // // //   clueBody:{fontFamily:FONT,fontSize:16,fontStyle:'italic',color:THEME.navy,marginTop:2},
// // // // //   clueTap:{fontFamily:FONT,fontSize:15,fontWeight:'800',color:'#7a4a2a',marginTop:2},

// // // // //   overlay:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.45)',alignItems:'center',justifyContent:'center',zIndex:50},
// // // // //   card:{width:'82%',alignItems:'center',backgroundColor:THEME.panel,borderWidth:8,borderColor:THEME.panelBorder,borderRadius:28,padding:20},
// // // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // // // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // // // //   load:{fontFamily:FONT,fontSize:22,color:THEME.navy,marginTop:12},
// // // // //   err:{fontFamily:FONT,fontSize:18,color:THEME.navy,textAlign:'center',paddingHorizontal:24},
// // // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // // // //   back:{fontFamily:FONT,fontSize:16,color:THEME.navy,marginTop:14,textDecorationLine:'underline'},
// // // // // });
// // // // import React,{useCallback,useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Animated,PanResponder,Platform,StyleSheet,ActivityIndicator,useWindowDimensions} from 'react-native';
// // // // import {Stage,Coin} from './BTShared';
// // // // import {Icon} from './Art';
// // // // import {BigStar} from './Btlevel7art';
// // // // import {Maze,Dog,Bone,DogHouse,OPEN_N,OPEN_E,OPEN_S,OPEN_W} from './Btlevel9art';
// // // // import {startLevel9,hintLevel9,finishLevel9,skipLevel9,rewardLevel9,Level9View,Level9Result} from './Btlevel9api';
// // // // import {THEME} from './Btlevel4Theme';

// // // // const FONT:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // const SERIF:any=Platform.select({ios:'Georgia',android:'serif',default:'Georgia, serif'});

// // // // // Level 5 palette
// // // // const L5={
// // // //   sky:'#5bbcf5',
// // // //   hillBack:'#8fd653',
// // // //   hillFront:'#66c944',
// // // //   grass:'#5cc23c',
// // // //   fence:'#f0b765',
// // // //   fenceDark:'#c98a3a',
// // // //   wood:'#e9a04c',
// // // //   woodBorder:'#c9772a',
// // // //   woodDot:'#a85f1c',
// // // //   sign:'#b8691f',
// // // //   signBorder:'#8a4a12',
// // // //   cream:'#f9efdf',
// // // //   creamBorder:'#ecd9b8',
// // // //   navy:'#1d2f6f',
// // // //   badge:'#6b3f1d',
// // // // };

// // // // // clues shown in the CLUES popup when the magnifier is tapped
// // // // const CLUE_1='The shortest route isn’t always obvious… guide your furry friend to the place where you feel at home.';

// // // // type Props={
// // // //   playerId:number;
// // // //   hints?:number;
// // // //   setHints?:(n:number)=>void;
// // // //   onExit:()=>void;
// // // //   onComplete?:(result:Level9Result)=>void;
// // // // };

// // // // const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
// // // // const PADC=1.3;                                    // free board around the maze, in cells
// // // // const DPAD_H=96;                                   // height of the arrow buttons block

// // // // /* ---------- Level 5 style outdoor background ---------- */

// // // // const Cloud=({style}:{style:any})=>(
// // // //   <View pointerEvents="none" style={[{position:'absolute',width:70,height:26},style]}>
// // // //     <View style={{position:'absolute',left:0,bottom:0,width:70,height:18,borderRadius:9,backgroundColor:'#fff'}}/>
// // // //     <View style={{position:'absolute',left:14,bottom:8,width:30,height:24,borderRadius:12,backgroundColor:'#fff'}}/>
// // // //     <View style={{position:'absolute',left:34,bottom:6,width:26,height:20,borderRadius:10,backgroundColor:'#fff'}}/>
// // // //   </View>
// // // // );

// // // // const Daisy=({style}:{style:any})=>(
// // // //   <View pointerEvents="none" style={[{position:'absolute',width:18,height:18,borderRadius:9,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},style]}>
// // // //     <View style={{width:7,height:7,borderRadius:4,backgroundColor:'#ffd23c'}}/>
// // // //   </View>
// // // // );

// // // // const BOOKS=[['#2a9d9f',34],['#ee4558',28],['#f4b82e',40],['#6b5bd6',30],['#3b78d8',36]];

// // // // const OutdoorBackground=()=>(
// // // //   <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // // //     <View style={{...StyleSheet.absoluteFillObject,backgroundColor:L5.sky}}/>

// // // //     <Cloud style={{top:'14%',right:14}}/>
// // // //     <Cloud style={{top:'44%',left:-14,transform:[{scale:0.8}]}}/>

// // // //     {/* hills */}
// // // //     <View style={{position:'absolute',left:-80,right:-80,top:'44%',height:260,borderTopLeftRadius:260,borderTopRightRadius:260,backgroundColor:L5.hillBack}}/>
// // // //     <View style={{position:'absolute',left:-120,width:360,top:'56%',height:260,borderTopLeftRadius:200,borderTopRightRadius:200,backgroundColor:L5.hillFront}}/>

// // // //     {/* bookshelf on the right */}
// // // //     <View style={{position:'absolute',right:0,bottom:150,width:78,height:170,backgroundColor:'#e29a45',borderWidth:3,borderColor:L5.fenceDark,borderTopLeftRadius:6}}>
// // // //       {[0,1].map(r=>(
// // // //         <View key={r} style={{position:'absolute',left:0,right:0,top:r*78+6,height:68,flexDirection:'row',alignItems:'flex-end',paddingHorizontal:4,gap:2,borderBottomWidth:4,borderBottomColor:L5.fenceDark}}>
// // // //           {BOOKS.slice(r*2,r*2+3).map((b,i)=><View key={i} style={{width:13,height:b[1] as number,backgroundColor:b[0] as string,borderRadius:2}}/>)}
// // // //         </View>
// // // //       ))}
// // // //     </View>

// // // //     {/* wooden fence */}
// // // //     <View style={{position:'absolute',left:0,right:0,bottom:130,height:56,flexDirection:'row',justifyContent:'space-around'}}>
// // // //       {Array.from({length:12}).map((_,i)=>(
// // // //         <View key={i} style={{width:26,height:56,backgroundColor:L5.fence,borderWidth:2,borderColor:L5.fenceDark,borderTopLeftRadius:13,borderTopRightRadius:13}}/>
// // // //       ))}
// // // //     </View>
// // // //     <View style={{position:'absolute',left:0,right:0,bottom:152,height:6,backgroundColor:L5.fenceDark}}/>

// // // //     {/* front grass */}
// // // //     <View style={{position:'absolute',left:0,right:0,bottom:0,height:140,backgroundColor:L5.grass}}/>
// // // //     <Daisy style={{bottom:128,left:'62%'}}/>
// // // //     <Daisy style={{bottom:112,left:'8%',transform:[{scale:0.8}]}}/>
// // // //     <Daisy style={{bottom:104,left:'82%',transform:[{scale:0.7}]}}/>
// // // //   </View>
// // // // );

// // // // export default function BTLevel9Screen({playerId,hints=0,setHints,onExit,onComplete}:Props){
// // // //   const {width,height}=useWindowDimensions();
// // // //   const RW=Math.min(width-24,360);                 // field width limit
// // // //   const IW=RW;

// // // //   const [view,setView]=useState<Level9View|null>(null);
// // // //   const [sessionId,setSessionId]=useState<number|null>(null);
// // // //   const [loadErr,setLoadErr]=useState('');
// // // //   const [msg,setMsg]=useState('');
// // // //   const [done,setDone]=useState(false);
// // // //   const [trail,setTrail]=useState<number[]>([]);
// // // //   const [hintCells,setHintCells]=useState<number[]>([]);
// // // //   const [result,setResult]=useState<Level9Result|null>(null);
// // // //   const [confirmSkip,setConfirmSkip]=useState(false);
// // // //   const [clueOpen,setClueOpen]=useState(false);

// // // //   const cols=view?view.cols:9;
// // // //   const rows=view?view.rows:9;
// // // //   const cs=Math.max(20,Math.floor(Math.min(IW/(cols+2*PADC),(height-350-(DPAD_H+6))/(rows+2*PADC))));   // one cell in pixels
// // // //   const ds=cs*0.9;                                                          // dog size
// // // //   const pad=cs*PADC;                                                        // board around the maze
// // // //   const FW=cols*cs+2*pad;                                                   // whole drag field
// // // //   const FH=rows*cs+2*pad;

// // // //   const dogPos=useRef(new Animated.ValueXY()).current;
// // // //   const hop=useRef(new Animated.Value(0)).current;
// // // //   const pop=useRef(new Animated.Value(0)).current;

// // // //   const geo=useRef({cs,cols,rows,ds,pad,FW,FH});
// // // //   geo.current={cs,cols,rows,ds,pad,FW,FH};
// // // //   const startRef=useRef(0);
// // // //   const outsideRef=useRef(false);                  // the dog is on the board, outside the maze
// // // //   const cellsRef=useRef<number[]>([]);
// // // //   const goalRef=useRef(0);
// // // //   const curRef=useRef(0);                          // the cell the dog stands on
// // // //   const pathRef=useRef<number[]>([0]);             // start -> bone (free drag)
// // // //   const dogC=useRef({x:0,y:0});                    // dog centre in maze pixels
// // // //   const touch=useRef({on:false,sx:0,sy:0});        // drag state
// // // //   const doneRef=useRef(false);
// // // //   const sessionRef=useRef<number|null>(null);
// // // //   const timers=useRef<any[]>([]);
// // // //   const msgTimer=useRef<any>(null);
// // // //   const later=(fn:()=>void,ms:number)=>{timers.current.push(setTimeout(fn,ms))};

// // // //   const flash=(m:string)=>{
// // // //     setMsg(m);clearTimeout(msgTimer.current);
// // // //     msgTimer.current=setTimeout(()=>setMsg(''),2800);
// // // //   };

// // // //   // put the dog (by its centre) at a pixel of the maze
// // // //   const moveDogTo=(x:number,y:number)=>{
// // // //     const q=geo.current;
// // // //     dogC.current={x,y};
// // // //     dogPos.setValue({x:x-q.ds/2,y:y-q.ds/2});
// // // //   };

// // // //   // centre pixel of a cell
// // // //   const centreOf=(c:number)=>{
// // // //     const g=geo.current;
// // // //     return {x:g.pad+(c%g.cols+0.5)*g.cs,y:g.pad+(Math.floor(c/g.cols)+0.5)*g.cs};
// // // //   };

// // // //   // 1. open the level - the backend builds a NEW maze every time
// // // //   const load=useCallback(()=>{
// // // //     setLoadErr('');setView(null);
// // // //     startLevel9(playerId)
// // // //       .then(v=>{
// // // //         cellsRef.current=v.cells;
// // // //         goalRef.current=v.goal;
// // // //         curRef.current=v.start;
// // // //         pathRef.current=[v.start];
// // // //         doneRef.current=false;
// // // //         touch.current={on:false,sx:0,sy:0};
// // // //         startRef.current=v.start;
// // // //         outsideRef.current=false;
// // // //         const g=geo.current;
// // // //         dogC.current={x:g.pad+(v.start%v.cols+0.5)*g.cs,y:g.pad+(Math.floor(v.start/v.cols)+0.5)*g.cs};
// // // //         setDone(false);setResult(null);setHintCells([]);setTrail([v.start]);
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

// // // //   // when the maze appears or the size changes, keep the dog on the same spot (scaled)
// // // //   const lastCs=useRef(cs);
// // // //   useEffect(()=>{
// // // //     if(!view)return;
// // // //     if(lastCs.current!==cs){
// // // //       const k=cs/lastCs.current;
// // // //       dogC.current={x:dogC.current.x*k,y:dogC.current.y*k};
// // // //       lastCs.current=cs;
// // // //     }
// // // //     moveDogTo(dogC.current.x,dogC.current.y);
// // // //   },[view,cs]);                                    // eslint-disable-line react-hooks/exhaustive-deps

// // // //   useEffect(()=>{
// // // //     if(result)Animated.spring(pop,{toValue:1,friction:5,tension:70,useNativeDriver:true}).start();
// // // //   },[result]);

// // // //   // 2. the dog reached the bone: tell the backend, it saves the win
// // // //   const finish=async(attempt:number)=>{
// // // //     const sid=sessionRef.current;
// // // //     if(!sid)return;
// // // //     try{
// // // //       const path=pathRef.current.slice();
// // // //       const r=await finishLevel9({sessionId:sid,playerId,path,moves:Math.max(1,path.length-1)});
// // // //       if(setHints&&typeof r.hints==='number')setHints(r.hints);
// // // //       setDone(true);
// // // //       Animated.sequence([
// // // //         Animated.timing(hop,{toValue:-14,duration:160,useNativeDriver:true}),
// // // //         Animated.timing(hop,{toValue:0,duration:160,useNativeDriver:true}),
// // // //         Animated.timing(hop,{toValue:-10,duration:140,useNativeDriver:true}),
// // // //         Animated.timing(hop,{toValue:0,duration:140,useNativeDriver:true}),
// // // //       ]).start();
// // // //       later(()=>setResult(r),1300);
// // // //     }catch(e:any){
// // // //       if(attempt<2){later(()=>finishRef.current(attempt+1),1200);return}
// // // //       doneRef.current=false;
// // // //       flash(e.message||'Network error. Move the dog a little and come back.');
// // // //     }
// // // //   };
// // // //   const finishRef=useRef(finish);
// // // //   finishRef.current=finish;

// // // //   // which maze cell is under a pixel of the field (-1 = on the board outside the maze)
// // // //   const cellAt=(x:number,y:number)=>{
// // // //     const q=geo.current;
// // // //     const mx=x-q.pad,my=y-q.pad;
// // // //     if(mx<0||my<0||mx>=q.cols*q.cs||my>=q.rows*q.cs)return -1;
// // // //     return Math.floor(my/q.cs)*q.cols+Math.floor(mx/q.cs);
// // // //   };

// // // //   // can the dog step from (ox,oy) to (nx,ny)?
// // // //   //  - inside the maze: only through open sides (walls block the dog)
// // // //   //  - outside the maze: free, but it cannot cut through the maze walls
// // // //   //  - the only gates: top of the start cell and bottom of the goal cell
// // // //   const stand=(ox:number,oy:number,nx:number,ny:number)=>{
// // // //     const q=geo.current,cells=cellsRef.current;
// // // //     if(nx<q.ds/2||nx>q.FW-q.ds/2||ny<q.ds/2||ny>q.FH-q.ds/2)return false;
// // // //     const mx0=q.pad,my0=q.pad,mx1=q.pad+q.cols*q.cs,my1=q.pad+q.rows*q.cs;
// // // //     const oc=cellAt(ox,oy),nc=cellAt(nx,ny);

// // // //     if(oc>=0&&nc>=0){                                       // inside -> inside
// // // //       if(oc===nc)return true;
// // // //       const dx=(nc%q.cols)-(oc%q.cols),dy=Math.floor(nc/q.cols)-Math.floor(oc/q.cols);
// // // //       if(Math.abs(dx)+Math.abs(dy)!==1)return false;
// // // //       const bit=dx>0?OPEN_E:dx<0?OPEN_W:dy>0?OPEN_S:OPEN_N;
// // // //       return !!(cells[oc]&bit);
// // // //     }
// // // //     if(oc<0&&nc<0){                                         // outside -> outside
// // // //       const B=q.ds*0.5;                                     // keep the dog off the outer wall
// // // //       const near=nx>mx0-B&&nx<mx1+B&&ny>my0-B&&ny<my1+B;
// // // //       if(!near)return true;
// // // //       const startGate=nx>=mx0&&nx<mx0+q.cs&&ny<my0;
// // // //       const goalGate=nx>=mx1-q.cs&&nx<mx1&&ny>=my1;
// // // //       return startGate||goalGate;
// // // //     }
// // // //     if(oc<0){                                               // outside -> inside
// // // //       if(nc===startRef.current&&oy<my0)return true;
// // // //       if(nc===goalRef.current&&oy>=my1)return true;
// // // //       return false;
// // // //     }
// // // //     if(oc===startRef.current&&ny<my0)return true;           // inside -> outside
// // // //     if(oc===goalRef.current&&ny>=my1)return true;
// // // //     return false;
// // // //   };

// // // //   // common logic after the dog moved (drag AND arrow buttons)
// // // //   const afterMove=(x:number,y:number)=>{
// // // //     const q=geo.current;
// // // //     moveDogTo(x,y);

// // // //     const cell=cellAt(x,y);
// // // //     outsideRef.current=cell<0;
// // // //     if(cell>=0&&cell!==curRef.current){
// // // //       curRef.current=cell;
// // // //       const p=pathRef.current;
// // // //       if(p.length>1&&p[p.length-2]===cell)p.pop();else p.push(cell);
// // // //       setTrail(p.slice());
// // // //     }

// // // //     // win: the dog reaches the bone. From the board outside, getting close to the bone house is enough.
// // // //     // Inside the maze the goal is walled off, so the only way to win is the outside way.
// // // //     const gp=centreOf(goalRef.current);
// // // //     const nearBone=cell<0&&Math.hypot(x-gp.x,y-gp.y)<=q.cs*1.4;
// // // //     if(nearBone||(cell>=0&&cell===goalRef.current)){
// // // //       doneRef.current=true;
// // // //       touch.current.on=false;
// // // //       setConfirmSkip(false);
// // // //       moveDogTo(gp.x,gp.y);                               // snap to the bone
// // // //       finishRef.current(0);
// // // //     }
// // // //   };

// // // //   // arrow buttons: one cell per tap (inside the maze), half a cell (outside on the board)
// // // //   const step=(dir:'U'|'D'|'L'|'R')=>{
// // // //     if(doneRef.current||!sessionRef.current)return;
// // // //     setConfirmSkip(false);
// // // //     const q=geo.current,d=dogC.current;
// // // //     const dx=dir==='L'?-1:dir==='R'?1:0,dy=dir==='U'?-1:dir==='D'?1:0;
// // // //     const oc=cellAt(d.x,d.y);
// // // //     let tx:number,ty:number;
// // // //     if(oc>=0){const c=centreOf(oc);tx=c.x+dx*q.cs;ty=c.y+dy*q.cs}
// // // //     else{tx=d.x+dx*q.cs*0.5;ty=d.y+dy*q.cs*0.5}
// // // //     let x=d.x,y=d.y;
// // // //     const n=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/(q.cs/6)));
// // // //     const sx=(tx-x)/n,sy=(ty-y)/n;
// // // //     for(let i=0;i<n;i+=1){
// // // //       if(stand(x,y,x+sx,y+sy)){x+=sx;y+=sy}
// // // //       else if(oc<0&&stand(x,y,x+sx,y)){x+=sx}
// // // //       else if(oc<0&&stand(x,y,x,y+sy)){y+=sy}
// // // //       else break;
// // // //     }
// // // //     if(oc>=0&&Math.hypot(tx-x,ty-y)>1)return;   // wall blocked
// // // //     if(x===d.x&&y===d.y)return;
// // // //     afterMove(x,y);
// // // //   };

// // // //   // grab the dog and drag it. Walls block it inside the maze, so the way to the bone is OUTSIDE.
// // // //   const pan=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // //     onMoveShouldSetPanResponder:()=>!doneRef.current&&!!sessionRef.current,
// // // //     onPanResponderTerminationRequest:()=>false,
// // // //     onPanResponderGrant:(e)=>{
// // // //       const q=geo.current,c=dogC.current;
// // // //       const d=Math.hypot(e.nativeEvent.locationX-c.x,e.nativeEvent.locationY-c.y);
// // // //       touch.current={on:d<=q.cs*1.1,sx:c.x,sy:c.y};         // touch must start on the dog
// // // //       setConfirmSkip(false);
// // // //     },
// // // //     onPanResponderMove:(_e,g)=>{
// // // //       const t=touch.current;
// // // //       if(doneRef.current||!t.on)return;
// // // //       const q=geo.current,d=dogC.current;

// // // //       // where the finger wants the dog (the finger never runs more than ~1 cell ahead of a blocked dog)
// // // //       let tx=t.sx+g.dx,ty=t.sy+g.dy;
// // // //       const ox=tx-d.x,oy=ty-d.y,len=Math.hypot(ox,oy),lim=q.cs*1.2;
// // // //       if(len>lim){const k=(len-lim)/len;t.sx-=ox*k;t.sy-=oy*k;tx-=ox*k;ty-=oy*k}

// // // //       // walk in small steps so a fast swipe cannot jump over a wall; slide along walls
// // // //       let x=d.x,y=d.y;
// // // //       const n=Math.max(1,Math.ceil(Math.hypot(tx-x,ty-y)/(q.cs/6)));
// // // //       const sx=(tx-x)/n,sy=(ty-y)/n;
// // // //       for(let i=0;i<n;i+=1){
// // // //         if(stand(x,y,x+sx,y+sy)){x+=sx;y+=sy}
// // // //         else if(stand(x,y,x+sx,y)){x+=sx}
// // // //         else if(stand(x,y,x,y+sy)){y+=sy}
// // // //       }
// // // //       if(x===d.x&&y===d.y)return;
// // // //       afterMove(x,y);
// // // //     },
// // // //     onPanResponderRelease:()=>{touch.current.on=false},
// // // //     onPanResponderTerminate:()=>{touch.current.on=false},
// // // //   })).current;

// // // //   // magnifier: inside the maze the server shows the way back to the exit (25 hints).
// // // //   // Then the CLUES popup opens. On the outside board it is free.
// // // //   const onHint=async()=>{
// // // //     if(done||!sessionId)return;
// // // //     setConfirmSkip(false);
// // // //     if(outsideRef.current){setClueOpen(true);return}   // free tip
// // // //     try{
// // // //       const r=await hintLevel9({sessionId,playerId,cell:curRef.current});
// // // //       setHints&&setHints(r.hints);
// // // //       setHintCells(r.path);
// // // //       later(()=>setHintCells([]),6000);
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
// // // //       const r=await rewardLevel9(playerId);
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
// // // //       const r=await skipLevel9({sessionId,playerId});
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
// // // //           <Text style={st.signT}>LEVEL 9</Text>
// // // //           <Text style={st.signArrow}>{'>'}</Text>
// // // //         </View>
// // // //       </View>

// // // //       <View style={st.pill}>
// // // //         <Text style={st.pillT}>{hints}</Text>
// // // //         <Text style={st.pillIcon}>💡</Text>
// // // //       </View>
// // // //     </View>
// // // //   );

// // // //   /* ---------- loading / error ---------- */

// // // //   if(loadErr||!view){
// // // //     return <Stage bg={L5.sky}><View style={st.root}>
// // // //       <OutdoorBackground/>
// // // //       {header}
// // // //       <View style={st.centerMsg}>
// // // //         {loadErr?<>
// // // //           <Text style={st.err}>{loadErr}</Text>
// // // //           <TouchableOpacity style={st.retry} onPress={load}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // // //           <TouchableOpacity onPress={onExit}><Text style={st.back}>Back</Text></TouchableOpacity>
// // // //         </>:<>
// // // //           <ActivityIndicator size="large" color={THEME.orange}/>
// // // //           <Text style={st.load}>Loading level 9...</Text>
// // // //         </>}
// // // //       </View>
// // // //     </View></Stage>;
// // // //   }

// // // //   const webTouch:any=Platform.OS==='web'?{touchAction:'none',userSelect:'none',cursor:'grab'}:{};
// // // //   const gx=pad+(view.goal%cols)*cs,gy=pad+Math.floor(view.goal/cols)*cs;

// // // //   return <Stage bg={L5.sky}><View style={st.root}>
// // // //     <OutdoorBackground/>
// // // //     {header}

// // // //     <View style={st.center}>
// // // //       {/* question pill (same as level 5) */}
// // // //       <View style={st.qPill}>
// // // //         <Text style={st.qArrow}>{'<'}</Text>
// // // //         <Text style={[st.q,msg?{color:'#c0392b'}:null]}>{msg||view.title}</Text>
// // // //         <Text style={st.qArrow}>{'>'}</Text>
// // // //       </View>

// // // //       {/* the maze: drag the dog to the bone */}
// // // //       <View style={[st.field,{width:FW,height:FH}]}>
// // // //         {/* the maze sits in the middle, the board around it is free to walk on */}
// // // //         <View style={{position:'absolute',left:pad,top:pad,width:cols*cs,height:rows*cs}}>
// // // //           <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal}/>
// // // //         </View>

// // // //         {/* dog house + bone at the goal */}
// // // //         <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.02,top:gy+cs*0.02}}><DogHouse w={cs*0.96}/></View>
// // // //         <View pointerEvents="none" style={{position:'absolute',left:gx+cs*0.06,top:gy+cs*0.66}}><Bone w={cs*0.8}/></View>

// // // //         {/* the dog */}
// // // //         <Animated.View pointerEvents="none"
// // // //           style={{position:'absolute',left:0,top:0,transform:[...dogPos.getTranslateTransform(),{translateY:hop}]}}>
// // // //           <Dog w={ds}/>
// // // //         </Animated.View>

// // // //         <View {...pan.panHandlers} style={[StyleSheet.absoluteFill,webTouch]}/>
// // // //       </View>

// // // //       {/* arrow buttons (below the maze) */}
// // // //       <View style={st.dpad}>
// // // //         <TouchableOpacity style={[st.arrow,{left:48,top:0}]} activeOpacity={0.8} onPress={()=>step('U')}><Text style={st.arrowT}>▲</Text></TouchableOpacity>
// // // //         <TouchableOpacity style={[st.arrow,{left:0,top:26}]} activeOpacity={0.8} onPress={()=>step('L')}><Text style={st.arrowT}>◀</Text></TouchableOpacity>
// // // //         <TouchableOpacity style={[st.arrow,{left:96,top:26}]} activeOpacity={0.8} onPress={()=>step('R')}><Text style={st.arrowT}>▶</Text></TouchableOpacity>
// // // //         <TouchableOpacity style={[st.arrow,{left:48,top:52}]} activeOpacity={0.8} onPress={()=>step('D')}><Text style={st.arrowT}>▼</Text></TouchableOpacity>
// // // //       </View>
// // // //     </View>

// // // //     {/* bottom wooden panel (same as level 5) */}
// // // //     <View style={st.panel}>
// // // //       <View style={[st.nail,{left:12,top:10}]}/><View style={[st.nail,{right:12,top:10}]}/>
// // // //       <View style={[st.nail,{left:12,bottom:10}]}/><View style={[st.nail,{right:12,bottom:10}]}/>

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
// // // //    STYLES  (Level 5 outdoor theme)
// // // // ========================================================= */

// // // // const st=StyleSheet.create({
// // // //   root:{flex:1,backgroundColor:L5.sky,overflow:'hidden'},

// // // //   topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:12,paddingTop:14},
// // // //   homeBtn:{width:44,height:44,borderRadius:22,backgroundColor:'#ffb21e',borderWidth:2.5,borderColor:'#e8912e',alignItems:'center',justifyContent:'center'},
// // // //   signWrap:{alignItems:'center',justifyContent:'center',paddingTop:12},
// // // //   string:{position:'absolute',top:0,width:3,height:16,backgroundColor:'#6e6e6e',borderRadius:2},
// // // //   sign:{flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:18,height:48,borderRadius:10,backgroundColor:L5.sign,borderWidth:3,borderColor:L5.signBorder},
// // // //   signT:{fontFamily:FONT,fontSize:24,fontWeight:'900',color:'#fff',letterSpacing:1},
// // // //   signArrow:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#ffd35c'},
// // // //   pill:{flexDirection:'row',alignItems:'center',gap:4,height:36,minWidth:70,justifyContent:'center',paddingHorizontal:12,borderRadius:18,backgroundColor:L5.cream,borderWidth:2,borderColor:L5.creamBorder},
// // // //   pillT:{fontFamily:FONT,fontSize:20,fontWeight:'900',color:'#1b1b1b'},
// // // //   pillIcon:{fontSize:16},

// // // //   center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingBottom:128},
// // // //   centerMsg:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24},
// // // //   qPill:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:L5.cream,borderWidth:3,borderColor:L5.creamBorder,borderRadius:30,paddingVertical:10,paddingHorizontal:18,marginBottom:10,maxWidth:360},
// // // //   qArrow:{fontFamily:FONT,fontSize:22,fontWeight:'900',color:'#f5a623'},
// // // //   q:{flexShrink:1,fontFamily:SERIF,fontSize:18,fontStyle:'italic',fontWeight:'600',color:L5.navy,textAlign:'center'},
// // // //   field:{backgroundColor:'#a6dd63',borderRadius:12,borderWidth:0},

// // // //   dpad:{width:140,height:DPAD_H,marginTop:6},
// // // //   arrow:{position:'absolute',width:44,height:44,borderRadius:22,backgroundColor:'#3bb0d0',borderWidth:3,borderColor:'#1b1b1b',alignItems:'center',justifyContent:'center'},
// // // //   arrowT:{fontSize:20,color:'#1b1b1b',fontWeight:'900'},

// // // //   panel:{position:'absolute',left:16,right:16,bottom:14,height:112,borderRadius:36,backgroundColor:L5.wood,borderWidth:8,borderColor:L5.woodBorder,
// // // //     flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:8},
// // // //   nail:{position:'absolute',width:9,height:9,borderRadius:5,backgroundColor:L5.woodDot},
// // // //   btnCol:{alignItems:'center'},
// // // //   ringGreen:{width:62,height:62,borderRadius:31,backgroundColor:'#f3d9a8',alignItems:'center',justifyContent:'center'},
// // // //   circleGreen:{width:52,height:52,borderRadius:26,backgroundColor:'#b3b12c',alignItems:'center',justifyContent:'center'},
// // // //   ringWhite:{width:62,height:62,borderRadius:31,backgroundColor:'#fff3dc',alignItems:'center',justifyContent:'center'},
// // // //   circleRed:{width:50,height:50,borderRadius:25,backgroundColor:THEME.red,alignItems:'center',justifyContent:'center'},
// // // //   badge:{flexDirection:'row',alignItems:'center',gap:3,marginTop:4,paddingHorizontal:10,height:24,borderRadius:12,backgroundColor:L5.badge},
// // // //   badgeT:{fontFamily:FONT,fontSize:14,fontWeight:'900',color:'#fff'},

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
// // // //   card:{width:'82%',alignItems:'center',backgroundColor:L5.cream,borderWidth:8,borderColor:L5.woodBorder,borderRadius:28,padding:20},
// // // //   cardTitle:{fontFamily:FONT,fontSize:28,fontWeight:'800',color:THEME.navy},
// // // //   cardMsg:{fontFamily:FONT,fontSize:17,color:THEME.navy,textAlign:'center',marginTop:6},
// // // //   stars:{flexDirection:'row',gap:6,marginTop:14},
// // // //   cardScore:{fontFamily:FONT,fontSize:22,fontWeight:'700',color:THEME.orange,marginTop:10},
// // // //   next:{marginTop:18,minWidth:170,height:56,borderRadius:28,backgroundColor:THEME.green,borderWidth:3,borderColor:THEME.greenRing,alignItems:'center',justifyContent:'center'},
// // // //   nextT:{fontFamily:FONT,fontSize:26,fontWeight:'900',color:THEME.navy},

// // // //   load:{fontFamily:FONT,fontSize:22,color:'#fff',marginTop:12},
// // // //   err:{fontFamily:FONT,fontSize:18,color:'#fff',textAlign:'center',paddingHorizontal:24},
// // // //   retry:{marginTop:16,paddingHorizontal:28,paddingVertical:10,borderRadius:22,backgroundColor:THEME.green,borderWidth:2.5,borderColor:THEME.greenRing},
// // // //   retryT:{fontFamily:FONT,fontSize:20,fontWeight:'800',color:THEME.navy},
// // // //   back:{fontFamily:FONT,fontSize:16,color:'#fff',marginTop:14,textDecorationLine:'underline'},
// // // // });
// // // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // // import {
// // //   View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// // // } from 'react-native';
// // // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // // import { Stage, F, Coin } from './BTShared';
// // // import { Icon } from './Art';
// // // import { BigStar } from './Btlevel5art';
// // // import { Maze, Dog, Bone, DogHouse, OPEN_N, OPEN_E, OPEN_S, OPEN_W } from './Btlevel9art';
// // // import { startLevel9, hintLevel9, finishLevel9, skipLevel9, rewardLevel9, Level9View, Level9Result } from './Btlevel9api';
// // // import { play } from './BTSound';

// // // const FONT: any = F;
// // // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // // /* garden palette (same as Level 5) */
// // // const NAVY = '#13235b';
// // // const SKY = '#5cc0f5';
// // // const CREAM = '#faf0e2';
// // // const CREAM_BORDER = '#ead2a4';
// // // const WOOD = '#eba24e';
// // // const WOOD_D = '#c2782c';
// // // const WOOD_DD = '#8f5a1f';
// // // const LIME = '#a4e02a';
// // // const LIME_RING = '#f4f1dc';
// // // const RED = '#f0434d';
// // // const ARROW = '#ffb629';
// // // const BADGE = '#6b4423';
// // // const GREEN_OK = '#3ec45a';
// // // const YEL_BTN = '#fbc02d';
// // // const YEL_BTN_D = '#d98e1c';

// // // // clue shown in the CLUES popup when the magnifier is tapped
// // // const CLUE_1 = 'The shortest route isn’t always obvious… guide your furry friend to the place where you feel at home.';

// // // type Props = {
// // //   playerId: number;
// // //   hints?: number;
// // //   setHints?: (n: number) => void;
// // //   onExit: () => void;
// // //   onComplete?: (result: Level9Result) => void;
// // // };

// // // const PADC = 1.3;      // free board around the maze, in cells
// // // const DPAD_H = 96;     // height of the arrow buttons block

// // // /* ---------- garden background (same as Level 5) ---------- */
// // // function Flower({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //       {[0, 72, 144, 216, 288].map((a) => (
// // //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// // //       ))}
// // //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// // //     </G>
// // //   );
// // // }

// // // function Tuft({ x, y }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// // //       <Polygon points="-14,0 -8,-34 -2,0" />
// // //       <Polygon points="-4,0 4,-44 12,0" />
// // //       <Polygon points="8,0 18,-30 24,0" />
// // //     </G>
// // //   );
// // // }

// // // function Cloud({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// // //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// // //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// // //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// // //     </G>
// // //   );
// // // }

// // // function Sprout({ x, y, s = 1 }: any) {
// // //   return (
// // //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// // //       <G fill="#5cb85c">
// // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
// // //         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
// // //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
// // //       </G>
// // //       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
// // //       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // //       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// // //       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
// // //       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
// // //       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// // //     </G>
// // //   );
// // // }

// // // function Garden() {
// // //   return (
// // //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// // //       {/* full-height sky */}
// // //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// // //         <Defs>
// // //           <LinearGradient id="g9sky" x1="0" y1="0" x2="0" y2="1">
// // //             <Stop offset="0" stopColor="#46b6f3" />
// // //             <Stop offset="1" stopColor="#c2e8fb" />
// // //           </LinearGradient>
// // //         </Defs>
// // //         <Rect width="10" height="10" fill="url(#g9sky)" />
// // //       </Svg>

// // //       {/* trees + cloud, pinned to the top */}
// // //       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
// // //         <Svg width="100%" height="100%" viewBox="0 0 942 330">
// // //           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// // //           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// // //           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// // //           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
// // //           <Cloud x={850} y={245} s={1} />
// // //         </Svg>
// // //       </View>

// // //       {/* ground: hills, fence, bookshelf, sprout, meadow */}
// // //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
// // //         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
// // //           <Cloud x={50} y={585} s={0.9} />
// // //           <Cloud x={880} y={600} s={0.6} />

// // //           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
// // //           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
// // //           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

// // //           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
// // //             const x = -10 + i * 90;
// // //             return (
// // //               <G key={i}>
// // //                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // //                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// // //               </G>
// // //             );
// // //           })}
// // //           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// // //           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// // //           <G>
// // //             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
// // //             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
// // //             <G fill="#4cb04a">
// // //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
// // //               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
// // //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
// // //             </G>
// // //             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
// // //             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
// // //             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
// // //             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
// // //             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
// // //             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
// // //             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
// // //             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
// // //             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
// // //             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
// // //             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
// // //             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
// // //             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
// // //           </G>

// // //           <Sprout x={10} y={740} s={1} />

// // //           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
// // //           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// // //           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// // //           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
// // //           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// // //           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

// // //           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
// // //           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
// // //           <Flower x="885" y="815" s={0.8} />
// // //           <Flower x="200" y="1225" s={0.95} />
// // //           <Flower x="735" y="1225" s={0.95} />
// // //         </Svg>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // /* ---------- thin link chain for the hanging sign ---------- */
// // // function Chain({ h = 28, style }: { h?: number; style?: any }) {
// // //   const n = Math.max(2, Math.round(h / 8));
// // //   return (
// // //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// // //       {Array.from({ length: n }).map((_, i) => (
// // //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// // //       ))}
// // //     </Svg>
// // //   );
// // // }

// // // /* ---------- double arrow (skip icon) ---------- */
// // // function DoubleArrow({ s }: { s: number }) {
// // //   return (
// // //     <Svg width={s} height={s} viewBox="0 0 100 100">
// // //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// // //     </Svg>
// // //   );
// // // }

// // // /* =========================================================
// // //    SCREEN
// // // ========================================================= */

// // // export default function BTLevel9Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
// // //   const { width, height } = useWindowDimensions();
// // //   const RW = Math.min(width - 24, 360);            // field width limit
// // //   const IW = RW;

// // //   const [view, setView] = useState<Level9View | null>(null);
// // //   const [sessionId, setSessionId] = useState<number | null>(null);
// // //   const [loadErr, setLoadErr] = useState('');
// // //   const [msg, setMsg] = useState('');
// // //   const [done, setDone] = useState(false);
// // //   const [trail, setTrail] = useState<number[]>([]);
// // //   const [hintCells, setHintCells] = useState<number[]>([]);
// // //   const [result, setResult] = useState<Level9Result | null>(null);
// // //   const [confirmSkip, setConfirmSkip] = useState(false);
// // //   const [clueOpen, setClueOpen] = useState(false);

// // //   const cols = view ? view.cols : 9;
// // //   const rows = view ? view.rows : 9;
// // //   const cs = Math.max(20, Math.floor(Math.min(IW / (cols + 2 * PADC), (height - 392 - (DPAD_H + 6)) / (rows + 2 * PADC))));   // one cell in pixels
// // //   const ds = cs * 0.9;                             // dog size
// // //   const pad = cs * PADC;                           // board around the maze
// // //   const FW = cols * cs + 2 * pad;                  // whole drag field
// // //   const FH = rows * cs + 2 * pad;

// // //   const dogPos = useRef(new Animated.ValueXY()).current;
// // //   const hop = useRef(new Animated.Value(0)).current;
// // //   const pop = useRef(new Animated.Value(0)).current;
// // //   const sway = useRef(new Animated.Value(0)).current;

// // //   const geo = useRef({ cs, cols, rows, ds, pad, FW, FH });
// // //   geo.current = { cs, cols, rows, ds, pad, FW, FH };
// // //   const startRef = useRef(0);
// // //   const outsideRef = useRef(false);                // the dog is on the board, outside the maze
// // //   const cellsRef = useRef<number[]>([]);
// // //   const goalRef = useRef(0);
// // //   const curRef = useRef(0);                        // the cell the dog stands on
// // //   const pathRef = useRef<number[]>([0]);           // start -> bone (free drag)
// // //   const dogC = useRef({ x: 0, y: 0 });             // dog centre in maze pixels
// // //   const touch = useRef({ on: false, sx: 0, sy: 0 });
// // //   const doneRef = useRef(false);
// // //   const sessionRef = useRef<number | null>(null);
// // //   const timers = useRef<any[]>([]);
// // //   const msgTimer = useRef<any>(null);
// // //   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

// // //   const flash = (m: string) => {
// // //     setMsg(m); clearTimeout(msgTimer.current);
// // //     msgTimer.current = setTimeout(() => setMsg(''), 2800);
// // //   };

// // //   // hanging sign sways gently (same as Level 5)
// // //   useEffect(() => {
// // //     const a = Animated.loop(Animated.sequence([
// // //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// // //     ]));
// // //     a.start();
// // //     return () => a.stop();
// // //   }, [sway]);
// // //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// // //   // put the dog (by its centre) at a pixel of the maze
// // //   const moveDogTo = (x: number, y: number) => {
// // //     const q = geo.current;
// // //     dogC.current = { x, y };
// // //     dogPos.setValue({ x: x - q.ds / 2, y: y - q.ds / 2 });
// // //   };

// // //   // centre pixel of a cell
// // //   const centreOf = (c: number) => {
// // //     const g = geo.current;
// // //     return { x: g.pad + (c % g.cols + 0.5) * g.cs, y: g.pad + (Math.floor(c / g.cols) + 0.5) * g.cs };
// // //   };

// // //   // 1. open the level - the backend builds a NEW maze every time
// // //   const load = useCallback(() => {
// // //     setLoadErr(''); setView(null);
// // //     startLevel9(playerId)
// // //       .then((v) => {
// // //         cellsRef.current = v.cells;
// // //         goalRef.current = v.goal;
// // //         curRef.current = v.start;
// // //         pathRef.current = [v.start];
// // //         doneRef.current = false;
// // //         touch.current = { on: false, sx: 0, sy: 0 };
// // //         startRef.current = v.start;
// // //         outsideRef.current = false;
// // //         const g = geo.current;
// // //         dogC.current = { x: g.pad + (v.start % v.cols + 0.5) * g.cs, y: g.pad + (Math.floor(v.start / v.cols) + 0.5) * g.cs };
// // //         setDone(false); setResult(null); setHintCells([]); setTrail([v.start]);
// // //         setSessionId(v.sessionId); sessionRef.current = v.sessionId;
// // //         setView(v);
// // //         if (setHints && typeof v.hints === 'number') setHints(v.hints);
// // //       })
// // //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// // //   }, [playerId]);                                  // eslint-disable-line react-hooks/exhaustive-deps

// // //   useEffect(() => {
// // //     load();
// // //     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
// // //   }, [load]);

// // //   // when the maze appears or the size changes, keep the dog on the same spot (scaled)
// // //   const lastCs = useRef(cs);
// // //   useEffect(() => {
// // //     if (!view) return;
// // //     if (lastCs.current !== cs) {
// // //       const k = cs / lastCs.current;
// // //       dogC.current = { x: dogC.current.x * k, y: dogC.current.y * k };
// // //       lastCs.current = cs;
// // //     }
// // //     moveDogTo(dogC.current.x, dogC.current.y);
// // //   }, [view, cs]);                                  // eslint-disable-line react-hooks/exhaustive-deps

// // //   // level complete -> card pops in + sound
// // //   useEffect(() => {
// // //     if (result) {
// // //       play('correct');
// // //       Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// // //     }
// // //   }, [result]);

// // //   // 2. the dog reached the bone: tell the backend, it saves the win
// // //   const finish = async (attempt: number) => {
// // //     const sid = sessionRef.current;
// // //     if (!sid) return;
// // //     try {
// // //       const path = pathRef.current.slice();
// // //       const r = await finishLevel9({ sessionId: sid, playerId, path, moves: Math.max(1, path.length - 1) });
// // //       if (setHints && typeof r.hints === 'number') setHints(r.hints);
// // //       setDone(true);
// // //       Animated.sequence([
// // //         Animated.timing(hop, { toValue: -14, duration: 160, useNativeDriver: true }),
// // //         Animated.timing(hop, { toValue: 0, duration: 160, useNativeDriver: true }),
// // //         Animated.timing(hop, { toValue: -10, duration: 140, useNativeDriver: true }),
// // //         Animated.timing(hop, { toValue: 0, duration: 140, useNativeDriver: true }),
// // //       ]).start();
// // //       later(() => setResult(r), 1300);
// // //     } catch (e: any) {
// // //       if (attempt < 2) { later(() => finishRef.current(attempt + 1), 1200); return; }
// // //       doneRef.current = false;
// // //       flash(e.message || 'Network error. Move the dog a little and come back.');
// // //     }
// // //   };
// // //   const finishRef = useRef(finish);
// // //   finishRef.current = finish;

// // //   // which maze cell is under a pixel of the field (-1 = on the board outside the maze)
// // //   const cellAt = (x: number, y: number) => {
// // //     const q = geo.current;
// // //     const mx = x - q.pad, my = y - q.pad;
// // //     if (mx < 0 || my < 0 || mx >= q.cols * q.cs || my >= q.rows * q.cs) return -1;
// // //     return Math.floor(my / q.cs) * q.cols + Math.floor(mx / q.cs);
// // //   };

// // //   // can the dog step from (ox,oy) to (nx,ny)?
// // //   //  - inside the maze: only through open sides (walls block the dog)
// // //   //  - outside the maze: free, but it cannot cut through the maze walls
// // //   //  - the only gates: top of the start cell and bottom of the goal cell
// // //   const stand = (ox: number, oy: number, nx: number, ny: number) => {
// // //     const q = geo.current, cells = cellsRef.current;
// // //     if (nx < q.ds / 2 || nx > q.FW - q.ds / 2 || ny < q.ds / 2 || ny > q.FH - q.ds / 2) return false;
// // //     const mx0 = q.pad, my0 = q.pad, mx1 = q.pad + q.cols * q.cs, my1 = q.pad + q.rows * q.cs;
// // //     const oc = cellAt(ox, oy), nc = cellAt(nx, ny);

// // //     if (oc >= 0 && nc >= 0) {                                 // inside -> inside
// // //       if (oc === nc) return true;
// // //       const dx = (nc % q.cols) - (oc % q.cols), dy = Math.floor(nc / q.cols) - Math.floor(oc / q.cols);
// // //       if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
// // //       const bit = dx > 0 ? OPEN_E : dx < 0 ? OPEN_W : dy > 0 ? OPEN_S : OPEN_N;
// // //       return !!(cells[oc] & bit);
// // //     }
// // //     if (oc < 0 && nc < 0) {                                   // outside -> outside
// // //       const B = q.ds * 0.5;                                   // keep the dog off the outer wall
// // //       const near = nx > mx0 - B && nx < mx1 + B && ny > my0 - B && ny < my1 + B;
// // //       if (!near) return true;
// // //       const startGate = nx >= mx0 && nx < mx0 + q.cs && ny < my0;
// // //       const goalGate = nx >= mx1 - q.cs && nx < mx1 && ny >= my1;
// // //       return startGate || goalGate;
// // //     }
// // //     if (oc < 0) {                                             // outside -> inside
// // //       if (nc === startRef.current && oy < my0) return true;
// // //       if (nc === goalRef.current && oy >= my1) return true;
// // //       return false;
// // //     }
// // //     if (oc === startRef.current && ny < my0) return true;     // inside -> outside
// // //     if (oc === goalRef.current && ny >= my1) return true;
// // //     return false;
// // //   };

// // //   // common logic after the dog moved (drag AND arrow buttons)
// // //   const afterMove = (x: number, y: number) => {
// // //     const q = geo.current;
// // //     moveDogTo(x, y);

// // //     const cell = cellAt(x, y);
// // //     outsideRef.current = cell < 0;
// // //     if (cell >= 0 && cell !== curRef.current) {
// // //       curRef.current = cell;
// // //       const p = pathRef.current;
// // //       if (p.length > 1 && p[p.length - 2] === cell) p.pop(); else p.push(cell);
// // //       setTrail(p.slice());
// // //     }

// // //     // win: the dog reaches the bone. From the board outside, getting close to the bone house is enough.
// // //     const gp = centreOf(goalRef.current);
// // //     const nearBone = cell < 0 && Math.hypot(x - gp.x, y - gp.y) <= q.cs * 1.4;
// // //     if (nearBone || (cell >= 0 && cell === goalRef.current)) {
// // //       doneRef.current = true;
// // //       touch.current.on = false;
// // //       setConfirmSkip(false);
// // //       moveDogTo(gp.x, gp.y);                                  // snap to the bone
// // //       finishRef.current(0);
// // //     }
// // //   };

// // //   // arrow buttons: one cell per tap (inside the maze), half a cell (outside on the board)
// // //   const step = (dir: 'U' | 'D' | 'L' | 'R') => {
// // //     if (doneRef.current || !sessionRef.current) return;
// // //     play('tap');
// // //     setConfirmSkip(false);
// // //     const q = geo.current, d = dogC.current;
// // //     const dx = dir === 'L' ? -1 : dir === 'R' ? 1 : 0, dy = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;
// // //     const oc = cellAt(d.x, d.y);
// // //     let tx: number, ty: number;
// // //     if (oc >= 0) { const c = centreOf(oc); tx = c.x + dx * q.cs; ty = c.y + dy * q.cs; }
// // //     else { tx = d.x + dx * q.cs * 0.5; ty = d.y + dy * q.cs * 0.5; }
// // //     let x = d.x, y = d.y;
// // //     const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
// // //     const sx = (tx - x) / n, sy = (ty - y) / n;
// // //     for (let i = 0; i < n; i += 1) {
// // //       if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
// // //       else if (oc < 0 && stand(x, y, x + sx, y)) { x += sx; }
// // //       else if (oc < 0 && stand(x, y, x, y + sy)) { y += sy; }
// // //       else break;
// // //     }
// // //     if (oc >= 0 && Math.hypot(tx - x, ty - y) > 1) return;   // wall blocked
// // //     if (x === d.x && y === d.y) return;
// // //     afterMove(x, y);
// // //   };

// // //   // grab the dog and drag it. Walls block it inside the maze, so the way to the bone is OUTSIDE.
// // //   const pan = useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
// // //     onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
// // //     onPanResponderTerminationRequest: () => false,
// // //     onPanResponderGrant: (e) => {
// // //       const q = geo.current, c = dogC.current;
// // //       const d = Math.hypot(e.nativeEvent.locationX - c.x, e.nativeEvent.locationY - c.y);
// // //       touch.current = { on: d <= q.cs * 1.1, sx: c.x, sy: c.y };   // touch must start on the dog
// // //       setConfirmSkip(false);
// // //     },
// // //     onPanResponderMove: (_e, g) => {
// // //       const t = touch.current;
// // //       if (doneRef.current || !t.on) return;
// // //       const q = geo.current, d = dogC.current;

// // //       // where the finger wants the dog (the finger never runs more than ~1 cell ahead of a blocked dog)
// // //       let tx = t.sx + g.dx, ty = t.sy + g.dy;
// // //       const ox = tx - d.x, oy = ty - d.y, len = Math.hypot(ox, oy), lim = q.cs * 1.2;
// // //       if (len > lim) { const k = (len - lim) / len; t.sx -= ox * k; t.sy -= oy * k; tx -= ox * k; ty -= oy * k; }

// // //       // walk in small steps so a fast swipe cannot jump over a wall; slide along walls
// // //       let x = d.x, y = d.y;
// // //       const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
// // //       const sx = (tx - x) / n, sy = (ty - y) / n;
// // //       for (let i = 0; i < n; i += 1) {
// // //         if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
// // //         else if (stand(x, y, x + sx, y)) { x += sx; }
// // //         else if (stand(x, y, x, y + sy)) { y += sy; }
// // //       }
// // //       if (x === d.x && y === d.y) return;
// // //       afterMove(x, y);
// // //     },
// // //     onPanResponderRelease: () => { touch.current.on = false; },
// // //     onPanResponderTerminate: () => { touch.current.on = false; },
// // //   })).current;

// // //   // magnifier: inside the maze the server shows the way back to the exit (25 hints).
// // //   // Then the CLUES popup opens. On the outside board it is free.
// // //   const onHint = async () => {
// // //     if (done || !sessionId) return;
// // //     setConfirmSkip(false);
// // //     if (outsideRef.current) { play('clue'); setClueOpen(true); return; }   // free tip
// // //     try {
// // //       const r = await hintLevel9({ sessionId, playerId, cell: curRef.current });
// // //       setHints && setHints(r.hints);
// // //       setHintCells(r.path);
// // //       later(() => setHintCells([]), 6000);
// // //       play('clue');
// // //       setClueOpen(true);
// // //     } catch (e: any) {
// // //       play('wrong');
// // //       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
// // //     }
// // //   };

// // //   // video reward (+75 hints)
// // //   const onReward = async () => {
// // //     if (done) return;
// // //     play('btn');
// // //     setConfirmSkip(false);
// // //     try {
// // //       const r = await rewardLevel9(playerId);
// // //       setHints && setHints(r.hints);
// // //       flash('+' + r.added + ' hints');
// // //     } catch (e: any) {
// // //       flash(e.message || 'Network error');
// // //     }
// // //   };

// // //   // skip (50 hints): tap twice
// // //   const onSkip = async () => {
// // //     if (done || !sessionId) return;
// // //     play('btn');
// // //     if (!confirmSkip) {
// // //       setConfirmSkip(true);
// // //       flash('Skip costs 50 hints. Tap again to skip.');
// // //       return;
// // //     }
// // //     try {
// // //       const r = await skipLevel9({ sessionId, playerId });
// // //       setHints && setHints(r.hints || 0);
// // //       doneRef.current = true;
// // //       onComplete ? onComplete(r) : onExit();
// // //     } catch (e: any) {
// // //       setConfirmSkip(false);
// // //       play('wrong');
// // //       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
// // //     }
// // //   };

// // //   /* ---------- header (same as Level 5) ---------- */
// // //   const header = (
// // //     <View style={st.topBar}>
// // //       <View style={st.leftBtns}>
// // //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
// // //           <Icon n="home" s={20} />
// // //         </TouchableOpacity>
// // //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// // //           <Icon n="gear" s={21} />
// // //         </TouchableOpacity>
// // //       </View>

// // //       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// // //         <Chain h={30} style={{ left: 24, top: -6 }} />
// // //         <Chain h={30} style={{ right: 24, top: -6 }} />
// // //         <View style={st.sign}>
// // //           <Text style={st.signArrow}>{'<'}</Text>
// // //           <Text style={st.signT}>LEVEL 9</Text>
// // //           <Text style={st.signArrow}>{'>'}</Text>
// // //         </View>
// // //       </Animated.View>

// // //       <View style={st.pillWrap}>
// // //         <View style={st.pill}>
// // //           <Text style={st.pillT}>{hints}</Text>
// // //         </View>
// // //         <View style={st.pillIcon}>
// // //           <Icon n="bulb" s={34} />
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );

// // //   /* ---------- loading / error ---------- */
// // //   if (loadErr || !view) {
// // //     return (
// // //       <Stage bg={SKY}>
// // //         <View style={st.root}>
// // //           <Garden />
// // //           {header}
// // //           <View style={st.centerMsg}>
// // //             {loadErr ? (
// // //               <>
// // //                 <Text style={st.err}>{loadErr}</Text>
// // //                 <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// // //                 <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <ActivityIndicator size="large" color="#fff" />
// // //                 <Text style={st.load}>Loading level 9...</Text>
// // //               </>
// // //             )}
// // //           </View>
// // //         </View>
// // //       </Stage>
// // //     );
// // //   }

// // //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' } : {};
// // //   const gx = pad + (view.goal % cols) * cs, gy = pad + Math.floor(view.goal / cols) * cs;

// // //   return (
// // //     <Stage bg={SKY}>
// // //       <View style={st.root}>
// // //         <Garden />
// // //         {header}

// // //         <View style={st.center}>
// // //           {/* question pill */}
// // //           <View style={st.qPill}>
// // //             <Text style={st.qArrow}>{'<'}</Text>
// // //             <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
// // //             <Text style={st.qArrow}>{'>'}</Text>
// // //           </View>

// // //           {/* the maze: drag the dog to the bone */}
// // //           <View style={[st.field, { width: FW, height: FH }]}>
// // //             <View style={{ position: 'absolute', left: pad, top: pad, width: cols * cs, height: rows * cs }}>
// // //               <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal} />
// // //             </View>

// // //             {/* dog house + bone at the goal */}
// // //             <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.02, top: gy + cs * 0.02 }}><DogHouse w={cs * 0.96} /></View>
// // //             <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.06, top: gy + cs * 0.66 }}><Bone w={cs * 0.8} /></View>

// // //             {/* the dog */}
// // //             <Animated.View pointerEvents="none"
// // //               style={{ position: 'absolute', left: 0, top: 0, transform: [...dogPos.getTranslateTransform(), { translateY: hop }] }}>
// // //               <Dog w={ds} />
// // //             </Animated.View>

// // //             <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
// // //           </View>

// // //           {/* arrow buttons (below the maze) */}
// // //           <View style={st.dpad}>
// // //             <TouchableOpacity style={[st.arrow, { left: 48, top: 0 }]} activeOpacity={0.8} onPress={() => step('U')}><Text style={st.arrowT}>▲</Text></TouchableOpacity>
// // //             <TouchableOpacity style={[st.arrow, { left: 0, top: 26 }]} activeOpacity={0.8} onPress={() => step('L')}><Text style={st.arrowT}>◀</Text></TouchableOpacity>
// // //             <TouchableOpacity style={[st.arrow, { left: 96, top: 26 }]} activeOpacity={0.8} onPress={() => step('R')}><Text style={st.arrowT}>▶</Text></TouchableOpacity>
// // //             <TouchableOpacity style={[st.arrow, { left: 48, top: 52 }]} activeOpacity={0.8} onPress={() => step('D')}><Text style={st.arrowT}>▼</Text></TouchableOpacity>
// // //           </View>
// // //         </View>

// // //         {/* bottom wooden panel (same as Level 5) */}
// // //         <View style={st.panel}>
// // //           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
// // //           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
// // //           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
// // //           <View style={[st.screw, { left: 16, top: 16 }]} />
// // //           <View style={[st.screw, { right: 16, top: 16 }]} />
// // //           <View style={[st.screw, { left: 16, bottom: 16 }]} />
// // //           <View style={[st.screw, { right: 16, bottom: 16 }]} />

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
// // //               <Icon n="search" s={40} />
// // //             </TouchableOpacity>
// // //             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>25</Text></View>
// // //           </View>

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
// // //               <Icon n="film" s={46} />
// // //             </TouchableOpacity>
// // //             <View style={st.badge}><Coin s={15} /><Text style={st.badgeT}>+75</Text></View>
// // //           </View>

// // //           <View style={st.btnCol}>
// // //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
// // //               <DoubleArrow s={42} />
// // //             </TouchableOpacity>
// // //             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>50</Text></View>
// // //           </View>
// // //         </View>

// // //         {/* CLUES popup (only from the magnifier) */}
// // //         {clueOpen && (
// // //           <View style={st.overlay}>
// // //             <View style={st.clueCard}>
// // //               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
// // //                 <Icon n="cross" s={20} />
// // //               </TouchableOpacity>
// // //               <Text style={st.clueTitle}>CLUES</Text>

// // //               <View style={[st.clueRow, st.clueRowOpen]}>
// // //                 <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// // //                 <View style={{ flex: 1 }}>
// // //                   <Text style={st.clueHead}>Clue 1</Text>
// // //                   <Text style={st.clueBody}>{CLUE_1}</Text>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         )}

// // //         {/* result card */}
// // //         {!!result && (
// // //           <View style={st.overlay}>
// // //             <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
// // //               <Text style={st.cardTitle}>Level complete!</Text>
// // //               <Text style={st.cardMsg}>{result.message}</Text>
// // //               <View style={st.stars}>{[1, 2, 3].map((n) => <BigStar key={n} s={46} on={n <= (result.stars || 0)} />)}</View>
// // //               <Text style={st.cardScore}>Score {result.score}</Text>
// // //               <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
// // //                 <Text style={st.nextT}>NEXT</Text>
// // //               </TouchableOpacity>
// // //             </Animated.View>
// // //           </View>
// // //         )}
// // //       </View>
// // //     </Stage>
// // //   );
// // // }

// // // /* =========================================================
// // //    STYLES (same as Level 5)
// // // ========================================================= */

// // // const st = StyleSheet.create({
// // //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// // //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
// // //   leftBtns: { flexDirection: 'row', gap: 8 },
// // //   woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
// // //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// // //   sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
// // //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// // //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// // //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// // //   pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
// // //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// // //   pillIcon: { position: 'absolute', right: -6, top: -4 },

// // //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 170 },
// // //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// // //   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 10, maxWidth: 380, elevation: 3 },
// // //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
// // //   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
// // //   field: { backgroundColor: '#a6dd63', borderRadius: 12, borderWidth: 0 },

// // //   dpad: { width: 140, height: DPAD_H, marginTop: 6 },
// // //   arrow: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#3bb0d0', borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// // //   arrowT: { fontSize: 20, color: '#1b1b1b', fontWeight: '900' },

// // //   // bottom wooden panel (solid wood, plank lines, corner rivets)
// // //   panel: {
// // //     position: 'absolute', left: 14, right: 14, bottom: 18, height: 148, borderRadius: 46,
// // //     backgroundColor: WOOD, borderWidth: 6, borderColor: WOOD_D,
// // //     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 20, elevation: 6,
// // //   },
// // //   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
// // //   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
// // //   btnCol: { alignItems: 'center' },
// // //   circleBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 7, alignItems: 'center', justifyContent: 'center', elevation: 6 },
// // //   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8, minWidth: 76, paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: BADGE },
// // //   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

// // //   clueCard: { width: '86%', maxWidth: 360, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 6, borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
// // //   clueTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 14 },
// // //   closeBtn: { position: 'absolute', top: -4, right: -4, width: 38, height: 38, borderRadius: 19, backgroundColor: WOOD, borderWidth: 3, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
// // //   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 22, borderWidth: 2.5, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12 },
// // //   clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
// // //   clueNum: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
// // //   clueNumT: { fontFamily: FONT, fontSize: 28, fontWeight: '900', color: '#fff' },
// // //   clueHead: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#bd6b29' },
// // //   clueBody: { fontFamily: SERIF, fontSize: 16, fontStyle: 'italic', color: '#17307a', marginTop: 2 },

// // //   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
// // //   card: { width: '82%', alignItems: 'center', backgroundColor: CREAM, borderWidth: 8, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
// // //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY },
// // //   cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
// // //   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
// // //   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#bd6b29', marginTop: 10 },
// // //   next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: '#8fe62d', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center' },
// // //   nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },

// // //   load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
// // //   err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// // //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
// // //   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
// // //   back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
// // // });
// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {
// //   View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// // } from 'react-native';
// // import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// // import { Stage, F, Coin } from './BTShared';
// // import { Icon } from './Art';
// // import { BigStar } from './Btlevel5art';
// // import { Maze, Dog, Bone, DogHouse, OPEN_N, OPEN_E, OPEN_S, OPEN_W } from './Btlevel9art';
// // import { startLevel9, hintLevel9, finishLevel9, skipLevel9, rewardLevel9, Level9View, Level9Result } from './Btlevel9api';
// // import { play } from './BTSound';

// // const FONT: any = F;
// // const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// // /* garden palette (same as Level 5) */
// // const NAVY = '#13235b';
// // const SKY = '#5cc0f5';
// // const CREAM = '#faf0e2';
// // const CREAM_BORDER = '#ead2a4';
// // const WOOD = '#eba24e';
// // const WOOD_D = '#c2782c';
// // const WOOD_DD = '#8f5a1f';
// // const LIME = '#a4e02a';
// // const LIME_RING = '#f4f1dc';
// // const RED = '#f0434d';
// // const ARROW = '#ffb629';
// // const BADGE = '#6b4423';
// // const GREEN_OK = '#3ec45a';
// // const YEL_BTN = '#fbc02d';
// // const YEL_BTN_D = '#d98e1c';

// // // shown only if the server did not send a clue text
// // const CLUE_FALLBACK = 'Find the correct path through the maze to help the dog reach its bone!';

// // type Props = {
// //   playerId: number;
// //   hints?: number;
// //   setHints?: (n: number) => void;
// //   onExit: () => void;
// //   onComplete?: (result: Level9Result) => void;
// // };

// // const PADC = 1.3;      // free board around the maze, in cells
// // const DPAD_H = 96;     // height of the arrow buttons block

// // /* ---------- garden background (same as Level 5) ---------- */
// // function Flower({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       {[0, 72, 144, 216, 288].map((a) => (
// //         <Ellipse key={a} cx="0" cy="-22" rx="14" ry="18" fill="#fff" transform={`rotate(${a})`} />
// //       ))}
// //       <Circle cx="0" cy="0" r="12" fill="#ffd33d" />
// //     </G>
// //   );
// // }

// // function Tuft({ x, y }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y})`} fill="#4fb12c">
// //       <Polygon points="-14,0 -8,-34 -2,0" />
// //       <Polygon points="-4,0 4,-44 12,0" />
// //       <Polygon points="8,0 18,-30 24,0" />
// //     </G>
// //   );
// // }

// // function Cloud({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
// //       <Ellipse cx="0" cy="0" rx="70" ry="26" />
// //       <Ellipse cx="-25" cy="-16" rx="38" ry="26" />
// //       <Ellipse cx="22" cy="-12" rx="30" ry="22" />
// //     </G>
// //   );
// // }

// // function Sprout({ x, y, s = 1 }: any) {
// //   return (
// //     <G transform={`translate(${x} ${y}) scale(${s})`}>
// //       <G fill="#5cb85c">
// //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(-25 60 58)" />
// //         <Ellipse cx="60" cy="0" rx="22" ry="62" fill="#6cc56a" />
// //         <Ellipse cx="60" cy="0" rx="20" ry="56" transform="rotate(25 60 58)" />
// //       </G>
// //       <Rect x="0" y="55" width="120" height="78" rx="36" fill="#fdf1ea" />
// //       <Ellipse cx="28" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// //       <Ellipse cx="92" cy="100" rx="11" ry="7" fill="#f6a5ae" />
// //       <Circle cx="45" cy="90" r="4.5" fill="#3a2a2a" />
// //       <Circle cx="75" cy="90" r="4.5" fill="#3a2a2a" />
// //       <Path d="M52 103 Q60 111 68 103" stroke="#3a2a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
// //     </G>
// //   );
// // }

// // function Garden() {
// //   return (
// //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// //       {/* full-height sky */}
// //       <Svg width="100%" height="100%" viewBox="0 0 10 10" preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
// //         <Defs>
// //           <LinearGradient id="g9sky" x1="0" y1="0" x2="0" y2="1">
// //             <Stop offset="0" stopColor="#46b6f3" />
// //             <Stop offset="1" stopColor="#c2e8fb" />
// //           </LinearGradient>
// //         </Defs>
// //         <Rect width="10" height="10" fill="url(#g9sky)" />
// //       </Svg>

// //       {/* trees + cloud, pinned to the top */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, aspectRatio: 942 / 330 }}>
// //         <Svg width="100%" height="100%" viewBox="0 0 942 330">
// //           <Ellipse cx="60" cy="10" rx="170" ry="100" fill="#4aae3a" />
// //           <Ellipse cx="120" cy="-10" rx="150" ry="90" fill="#5bbb43" />
// //           <Ellipse cx="810" cy="5" rx="210" ry="100" fill="#58b843" />
// //           <Ellipse cx="760" cy="-15" rx="150" ry="85" fill="#66c64a" />
// //           <Cloud x={850} y={245} s={1} />
// //         </Svg>
// //       </View>

// //       {/* ground: hills, fence, bookshelf, sprout, meadow */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, aspectRatio: 942 / 1269 }}>
// //         <Svg width="100%" height="100%" viewBox="0 0 942 1269">
// //           <Cloud x={50} y={585} s={0.9} />
// //           <Cloud x={880} y={600} s={0.6} />

// //           <Ellipse cx="150" cy="760" rx="300" ry="150" fill="#9ad95f" />
// //           <Ellipse cx="640" cy="810" rx="420" ry="120" fill="#6cc13a" />
// //           <Ellipse cx="900" cy="770" rx="200" ry="110" fill="#5fb832" />

// //           {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
// //             const x = -10 + i * 90;
// //             return (
// //               <G key={i}>
// //                 <Polygon points={`${x},730 ${x + 33},698 ${x + 66},730`} fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //                 <Rect x={x} y="730" width="66" height="105" fill="#f0b563" stroke="#c98a3e" strokeWidth="3" />
// //               </G>
// //             );
// //           })}
// //           <Rect x="0" y="760" width="942" height="20" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />
// //           <Rect x="0" y="808" width="942" height="16" fill="#f4c27a" stroke="#c98a3e" strokeWidth="3" />

// //           <G>
// //             <Rect x="845" y="190" width="80" height="18" rx="4" fill="#e8903a" />
// //             <Polygon points="852,208 918,208 910,250 860,250" fill="#f0a050" />
// //             <G fill="#4cb04a">
// //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(-28 885 198)" />
// //               <Ellipse cx="885" cy="140" rx="20" ry="62" fill="#3a9a3c" />
// //               <Ellipse cx="885" cy="145" rx="20" ry="58" transform="rotate(28 885 198)" />
// //             </G>
// //             <Rect x="780" y="250" width="162" height="575" fill="#eaa24f" />
// //             <Rect x="796" y="266" width="146" height="545" fill="#dc9d4f" />
// //             <Rect x="780" y="440" width="162" height="16" fill="#f2b866" />
// //             <Rect x="780" y="630" width="162" height="16" fill="#f2b866" />
// //             <Rect x="780" y="250" width="162" height="16" fill="#f2b866" />
// //             <Rect x="810" y="310" width="36" height="130" fill="#2a9d9d" />
// //             <Rect x="850" y="290" width="34" height="150" fill="#f06ba8" />
// //             <Rect x="888" y="315" width="40" height="125" fill="#8a63da" />
// //             <Rect x="805" y="515" width="30" height="115" fill="#e5484d" />
// //             <Rect x="840" y="490" width="24" height="140" fill="#3b82e0" />
// //             <Rect x="868" y="510" width="38" height="120" fill="#4caf50" />
// //             <Rect x="810" y="695" width="34" height="120" fill="#f5c518" />
// //             <Rect x="848" y="665" width="40" height="150" fill="#2c6fdc" />
// //           </G>

// //           <Sprout x={10} y={740} s={1} />

// //           <Path d="M0 885 C140 830 300 855 470 845 C650 833 800 805 942 785 L942 1269 L0 1269 Z" fill="#74d13c" />
// //           <Ellipse cx="300" cy="930" rx="220" ry="26" fill="#86dc4a" opacity="0.5" />

// //           <Ellipse cx="62" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="55" cy="1135" rx="50" ry="26" fill="#b4b4b4" />
// //           <Ellipse cx="880" cy="1145" rx="68" ry="40" fill="#9b9b9b" />
// //           <Ellipse cx="888" cy="1135" rx="50" ry="26" fill="#b4b4b4" />

// //           <Tuft x="905" y="925" /><Tuft x="910" y="1050" /><Tuft x="20" y="1040" />
// //           <Tuft x="100" y="1260" /><Tuft x="340" y="1260" /><Tuft x="580" y="1260" /><Tuft x="820" y="1260" />
// //           <Flower x="885" y="815" s={0.8} />
// //           <Flower x="200" y="1225" s={0.95} />
// //           <Flower x="735" y="1225" s={0.95} />
// //         </Svg>
// //       </View>
// //     </View>
// //   );
// // }

// // /* ---------- thin link chain for the hanging sign ---------- */
// // function Chain({ h = 28, style }: { h?: number; style?: any }) {
// //   const n = Math.max(2, Math.round(h / 8));
// //   return (
// //     <Svg pointerEvents="none" width={8} height={h} viewBox={`0 0 12 ${h}`} style={[{ position: 'absolute' }, style]}>
// //       {Array.from({ length: n }).map((_, i) => (
// //         <Ellipse key={i} cx="6" cy={7 + i * ((h - 8) / n)} rx="4.5" ry="7" fill="none" stroke="#6b6b6b" strokeWidth="2.5" />
// //       ))}
// //     </Svg>
// //   );
// // }

// // /* ---------- double arrow (skip icon) ---------- */
// // function DoubleArrow({ s }: { s: number }) {
// //   return (
// //     <Svg width={s} height={s} viewBox="0 0 100 100">
// //       <Polygon points="10,15 52,50 10,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //       <Polygon points="50,15 92,50 50,85" fill="#5a1418" stroke="#5a1418" strokeWidth="6" strokeLinejoin="round" />
// //     </Svg>
// //   );
// // }

// // /* =========================================================
// //    SCREEN
// // ========================================================= */

// // export default function BTLevel9Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
// //   const { width, height } = useWindowDimensions();
// //   const RW = Math.min(width - 24, 360);            // field width limit
// //   const IW = RW;

// //   const [view, setView] = useState<Level9View | null>(null);
// //   const [sessionId, setSessionId] = useState<number | null>(null);
// //   const [loadErr, setLoadErr] = useState('');
// //   const [msg, setMsg] = useState('');
// //   const [done, setDone] = useState(false);
// //   const [trail, setTrail] = useState<number[]>([]);
// //   const [hintCells, setHintCells] = useState<number[]>([]);
// //   const [result, setResult] = useState<Level9Result | null>(null);
// //   const [confirmSkip, setConfirmSkip] = useState(false);
// //   const [clueOpen, setClueOpen] = useState(false);
// //   const [clueText, setClueText] = useState('');        // clue text that comes from the backend

// //   const cols = view ? view.cols : 9;
// //   const rows = view ? view.rows : 9;
// //   const cs = Math.max(20, Math.floor(Math.min(IW / (cols + 2 * PADC), (height - 392 - (DPAD_H + 6)) / (rows + 2 * PADC))));   // one cell in pixels
// //   const ds = cs * 0.9;                             // dog size
// //   const pad = cs * PADC;                           // board around the maze
// //   const FW = cols * cs + 2 * pad;                  // whole drag field
// //   const FH = rows * cs + 2 * pad;

// //   const dogPos = useRef(new Animated.ValueXY()).current;
// //   const hop = useRef(new Animated.Value(0)).current;
// //   const pop = useRef(new Animated.Value(0)).current;
// //   const sway = useRef(new Animated.Value(0)).current;

// //   const geo = useRef({ cs, cols, rows, ds, pad, FW, FH });
// //   geo.current = { cs, cols, rows, ds, pad, FW, FH };
// //   const startRef = useRef(0);
// //   const outsideRef = useRef(false);                // the dog is on the board, outside the maze
// //   const cellsRef = useRef<number[]>([]);
// //   const goalRef = useRef(0);
// //   const curRef = useRef(0);                        // the cell the dog stands on
// //   const pathRef = useRef<number[]>([0]);           // start -> bone (free drag)
// //   const dogC = useRef({ x: 0, y: 0 });             // dog centre in maze pixels
// //   const touch = useRef({ on: false, sx: 0, sy: 0 });
// //   const doneRef = useRef(false);
// //   const sessionRef = useRef<number | null>(null);
// //   const hintBusy = useRef(false);                  // a hint request is on its way
// //   const timers = useRef<any[]>([]);
// //   const msgTimer = useRef<any>(null);
// //   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

// //   const flash = (m: string) => {
// //     setMsg(m); clearTimeout(msgTimer.current);
// //     msgTimer.current = setTimeout(() => setMsg(''), 2800);
// //   };

// //   // hanging sign sways gently (same as Level 5)
// //   useEffect(() => {
// //     const a = Animated.loop(Animated.sequence([
// //       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //     ]));
// //     a.start();
// //     return () => a.stop();
// //   }, [sway]);
// //   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

// //   // put the dog (by its centre) at a pixel of the maze
// //   const moveDogTo = (x: number, y: number) => {
// //     const q = geo.current;
// //     dogC.current = { x, y };
// //     dogPos.setValue({ x: x - q.ds / 2, y: y - q.ds / 2 });
// //   };

// //   // centre pixel of a cell
// //   const centreOf = (c: number) => {
// //     const g = geo.current;
// //     return { x: g.pad + (c % g.cols + 0.5) * g.cs, y: g.pad + (Math.floor(c / g.cols) + 0.5) * g.cs };
// //   };

// //   // 1. open the level - the backend builds a NEW maze every time
// //   const load = useCallback(() => {
// //     setLoadErr(''); setView(null);
// //     startLevel9(playerId)
// //       .then((v) => {
// //         cellsRef.current = v.cells;
// //         goalRef.current = v.goal;
// //         curRef.current = v.start;
// //         pathRef.current = [v.start];
// //         doneRef.current = false;
// //         touch.current = { on: false, sx: 0, sy: 0 };
// //         startRef.current = v.start;
// //         outsideRef.current = false;
// //         const g = geo.current;
// //         dogC.current = { x: g.pad + (v.start % v.cols + 0.5) * g.cs, y: g.pad + (Math.floor(v.start / v.cols) + 0.5) * g.cs };
// //         setDone(false); setResult(null); setHintCells([]); setTrail([v.start]);
// //         setClueOpen(false); setClueText('');
// //         setSessionId(v.sessionId); sessionRef.current = v.sessionId;
// //         setView(v);
// //         if (setHints && typeof v.hints === 'number') setHints(v.hints);
// //       })
// //       .catch((e: any) => setLoadErr(e.message || 'Cannot reach the server'));
// //   }, [playerId]);                                  // eslint-disable-line react-hooks/exhaustive-deps

// //   useEffect(() => {
// //     load();
// //     return () => { timers.current.forEach(clearTimeout); clearTimeout(msgTimer.current); };
// //   }, [load]);

// //   // when the maze appears or the size changes, keep the dog on the same spot (scaled)
// //   const lastCs = useRef(cs);
// //   useEffect(() => {
// //     if (!view) return;
// //     if (lastCs.current !== cs) {
// //       const k = cs / lastCs.current;
// //       dogC.current = { x: dogC.current.x * k, y: dogC.current.y * k };
// //       lastCs.current = cs;
// //     }
// //     moveDogTo(dogC.current.x, dogC.current.y);
// //   }, [view, cs]);                                  // eslint-disable-line react-hooks/exhaustive-deps

// //   // level complete -> card pops in + sound
// //   useEffect(() => {
// //     if (result) {
// //       play('correct');
// //       Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
// //     }
// //   }, [result]);

// //   // 2. the dog reached the bone: tell the backend, it saves the win
// //   const finish = async (attempt: number) => {
// //     const sid = sessionRef.current;
// //     if (!sid) return;
// //     try {
// //       const path = pathRef.current.slice();
// //       const r = await finishLevel9({ sessionId: sid, playerId, path, moves: Math.max(1, path.length - 1) });
// //       if (setHints && typeof r.hints === 'number') setHints(r.hints);
// //       setDone(true);
// //       Animated.sequence([
// //         Animated.timing(hop, { toValue: -14, duration: 160, useNativeDriver: true }),
// //         Animated.timing(hop, { toValue: 0, duration: 160, useNativeDriver: true }),
// //         Animated.timing(hop, { toValue: -10, duration: 140, useNativeDriver: true }),
// //         Animated.timing(hop, { toValue: 0, duration: 140, useNativeDriver: true }),
// //       ]).start();
// //       later(() => setResult(r), 1300);
// //     } catch (e: any) {
// //       if (attempt < 2) { later(() => finishRef.current(attempt + 1), 1200); return; }
// //       doneRef.current = false;
// //       flash(e.message || 'Network error. Move the dog a little and come back.');
// //     }
// //   };
// //   const finishRef = useRef(finish);
// //   finishRef.current = finish;

// //   // which maze cell is under a pixel of the field (-1 = on the board outside the maze)
// //   const cellAt = (x: number, y: number) => {
// //     const q = geo.current;
// //     const mx = x - q.pad, my = y - q.pad;
// //     if (mx < 0 || my < 0 || mx >= q.cols * q.cs || my >= q.rows * q.cs) return -1;
// //     return Math.floor(my / q.cs) * q.cols + Math.floor(mx / q.cs);
// //   };

// //   // can the dog step from (ox,oy) to (nx,ny)?
// //   //  - inside the maze: only through open sides (walls block the dog)
// //   //  - outside the maze: free, but it cannot cut through the maze walls
// //   //  - the only gates: top of the start cell and bottom of the goal cell
// //   const stand = (ox: number, oy: number, nx: number, ny: number) => {
// //     const q = geo.current, cells = cellsRef.current;
// //     if (nx < q.ds / 2 || nx > q.FW - q.ds / 2 || ny < q.ds / 2 || ny > q.FH - q.ds / 2) return false;
// //     const mx0 = q.pad, my0 = q.pad, mx1 = q.pad + q.cols * q.cs, my1 = q.pad + q.rows * q.cs;
// //     const oc = cellAt(ox, oy), nc = cellAt(nx, ny);

// //     if (oc >= 0 && nc >= 0) {                                 // inside -> inside
// //       if (oc === nc) return true;
// //       const dx = (nc % q.cols) - (oc % q.cols), dy = Math.floor(nc / q.cols) - Math.floor(oc / q.cols);
// //       if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
// //       const bit = dx > 0 ? OPEN_E : dx < 0 ? OPEN_W : dy > 0 ? OPEN_S : OPEN_N;
// //       return !!(cells[oc] & bit);
// //     }
// //     if (oc < 0 && nc < 0) {                                   // outside -> outside
// //       const B = q.ds * 0.5;                                   // keep the dog off the outer wall
// //       const near = nx > mx0 - B && nx < mx1 + B && ny > my0 - B && ny < my1 + B;
// //       if (!near) return true;
// //       const startGate = nx >= mx0 && nx < mx0 + q.cs && ny < my0;
// //       const goalGate = nx >= mx1 - q.cs && nx < mx1 && ny >= my1;
// //       return startGate || goalGate;
// //     }
// //     if (oc < 0) {                                             // outside -> inside
// //       if (nc === startRef.current && oy < my0) return true;
// //       if (nc === goalRef.current && oy >= my1) return true;
// //       return false;
// //     }
// //     if (oc === startRef.current && ny < my0) return true;     // inside -> outside
// //     if (oc === goalRef.current && ny >= my1) return true;
// //     return false;
// //   };

// //   // common logic after the dog moved (drag AND arrow buttons)
// //   const afterMove = (x: number, y: number) => {
// //     const q = geo.current;
// //     moveDogTo(x, y);

// //     const cell = cellAt(x, y);
// //     outsideRef.current = cell < 0;
// //     if (cell >= 0 && cell !== curRef.current) {
// //       curRef.current = cell;
// //       const p = pathRef.current;
// //       if (p.length > 1 && p[p.length - 2] === cell) p.pop(); else p.push(cell);
// //       setTrail(p.slice());
// //     }

// //     // win: the dog reaches the bone. From the board outside, getting close to the bone house is enough.
// //     const gp = centreOf(goalRef.current);
// //     const nearBone = cell < 0 && Math.hypot(x - gp.x, y - gp.y) <= q.cs * 1.4;
// //     if (nearBone || (cell >= 0 && cell === goalRef.current)) {
// //       doneRef.current = true;
// //       touch.current.on = false;
// //       setConfirmSkip(false);
// //       moveDogTo(gp.x, gp.y);                                  // snap to the bone
// //       finishRef.current(0);
// //     }
// //   };

// //   // arrow buttons: one cell per tap (inside the maze), half a cell (outside on the board)
// //   const step = (dir: 'U' | 'D' | 'L' | 'R') => {
// //     if (doneRef.current || !sessionRef.current) return;
// //     play('tap');
// //     setConfirmSkip(false);
// //     const q = geo.current, d = dogC.current;
// //     const dx = dir === 'L' ? -1 : dir === 'R' ? 1 : 0, dy = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;
// //     const oc = cellAt(d.x, d.y);
// //     let tx: number, ty: number;
// //     if (oc >= 0) { const c = centreOf(oc); tx = c.x + dx * q.cs; ty = c.y + dy * q.cs; }
// //     else { tx = d.x + dx * q.cs * 0.5; ty = d.y + dy * q.cs * 0.5; }
// //     let x = d.x, y = d.y;
// //     const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
// //     const sx = (tx - x) / n, sy = (ty - y) / n;
// //     for (let i = 0; i < n; i += 1) {
// //       if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
// //       else if (oc < 0 && stand(x, y, x + sx, y)) { x += sx; }
// //       else if (oc < 0 && stand(x, y, x, y + sy)) { y += sy; }
// //       else break;
// //     }
// //     if (oc >= 0 && Math.hypot(tx - x, ty - y) > 1) return;   // wall blocked
// //     if (x === d.x && y === d.y) return;
// //     afterMove(x, y);
// //   };

// //   // grab the dog and drag it. Walls block it inside the maze, so the way to the bone is OUTSIDE.
// //   const pan = useRef(PanResponder.create({
// //     onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
// //     onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
// //     onPanResponderTerminationRequest: () => false,
// //     onPanResponderGrant: (e) => {
// //       const q = geo.current, c = dogC.current;
// //       const d = Math.hypot(e.nativeEvent.locationX - c.x, e.nativeEvent.locationY - c.y);
// //       touch.current = { on: d <= q.cs * 1.1, sx: c.x, sy: c.y };   // touch must start on the dog
// //       setConfirmSkip(false);
// //     },
// //     onPanResponderMove: (_e, g) => {
// //       const t = touch.current;
// //       if (doneRef.current || !t.on) return;
// //       const q = geo.current, d = dogC.current;

// //       // where the finger wants the dog (the finger never runs more than ~1 cell ahead of a blocked dog)
// //       let tx = t.sx + g.dx, ty = t.sy + g.dy;
// //       const ox = tx - d.x, oy = ty - d.y, len = Math.hypot(ox, oy), lim = q.cs * 1.2;
// //       if (len > lim) { const k = (len - lim) / len; t.sx -= ox * k; t.sy -= oy * k; tx -= ox * k; ty -= oy * k; }

// //       // walk in small steps so a fast swipe cannot jump over a wall; slide along walls
// //       let x = d.x, y = d.y;
// //       const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
// //       const sx = (tx - x) / n, sy = (ty - y) / n;
// //       for (let i = 0; i < n; i += 1) {
// //         if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
// //         else if (stand(x, y, x + sx, y)) { x += sx; }
// //         else if (stand(x, y, x, y + sy)) { y += sy; }
// //       }
// //       if (x === d.x && y === d.y) return;
// //       afterMove(x, y);
// //     },
// //     onPanResponderRelease: () => { touch.current.on = false; },
// //     onPanResponderTerminate: () => { touch.current.on = false; },
// //   })).current;

// //   // magnifier: the request goes to the backend, the backend saves it in the database and answers in JSON
// //   //  { clue, path, hints, cost }.  Inside the maze it costs 25 hints and shows the way back to the exit.
// //   //  On the outside board (cell = -1) the clue is free.
// //   const onHint = async () => {
// //     if (done || !sessionId || hintBusy.current) return;
// //     setConfirmSkip(false);
// //     hintBusy.current = true;
// //     try {
// //       const r = await hintLevel9({
// //         sessionId,
// //         playerId,
// //         cell: outsideRef.current ? -1 : curRef.current,
// //       });
// //       if (setHints && typeof r.hints === 'number') setHints(r.hints);
// //       setHintCells(Array.isArray(r.path) ? r.path : []);
// //       later(() => setHintCells([]), 6000);
// //       setClueText(r.clue || CLUE_FALLBACK);
// //       play('clue');
// //       setClueOpen(true);
// //     } catch (e: any) {
// //       play('wrong');
// //       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
// //     } finally {
// //       hintBusy.current = false;
// //     }
// //   };

// //   // video reward (+75 hints)
// //   const onReward = async () => {
// //     if (done) return;
// //     play('btn');
// //     setConfirmSkip(false);
// //     try {
// //       const r = await rewardLevel9(playerId);
// //       setHints && setHints(r.hints);
// //       flash('+' + r.added + ' hints');
// //     } catch (e: any) {
// //       flash(e.message || 'Network error');
// //     }
// //   };

// //   // skip (50 hints): tap twice
// //   const onSkip = async () => {
// //     if (done || !sessionId) return;
// //     play('btn');
// //     if (!confirmSkip) {
// //       setConfirmSkip(true);
// //       flash('Skip costs 50 hints. Tap again to skip.');
// //       return;
// //     }
// //     try {
// //       const r = await skipLevel9({ sessionId, playerId });
// //       setHints && setHints(r.hints || 0);
// //       doneRef.current = true;
// //       onComplete ? onComplete(r) : onExit();
// //     } catch (e: any) {
// //       setConfirmSkip(false);
// //       play('wrong');
// //       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
// //     }
// //   };

// //   /* ---------- header (same as Level 5) ---------- */
// //   const header = (
// //     <View style={st.topBar}>
// //       <View style={st.leftBtns}>
// //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85} onPress={() => { play('btn'); onExit(); }}>
// //           <Icon n="home" s={20} />
// //         </TouchableOpacity>
// //         <TouchableOpacity style={st.woodBtn} activeOpacity={0.85}>
// //           <Icon n="gear" s={21} />
// //         </TouchableOpacity>
// //       </View>

// //       <Animated.View style={[st.signWrap, { transform: [{ rotate: swayR }] }]}>
// //         <Chain h={30} style={{ left: 24, top: -6 }} />
// //         <Chain h={30} style={{ right: 24, top: -6 }} />
// //         <View style={st.sign}>
// //           <Text style={st.signArrow}>{'<'}</Text>
// //           <Text style={st.signT}>LEVEL 9</Text>
// //           <Text style={st.signArrow}>{'>'}</Text>
// //         </View>
// //       </Animated.View>

// //       <View style={st.pillWrap}>
// //         <View style={st.pill}>
// //           <Text style={st.pillT}>{hints}</Text>
// //         </View>
// //         <View style={st.pillIcon}>
// //           <Icon n="bulb" s={34} />
// //         </View>
// //       </View>
// //     </View>
// //   );

// //   /* ---------- loading / error ---------- */
// //   if (loadErr || !view) {
// //     return (
// //       <Stage bg={SKY}>
// //         <View style={st.root}>
// //           <Garden />
// //           {header}
// //           <View style={st.centerMsg}>
// //             {loadErr ? (
// //               <>
// //                 <Text style={st.err}>{loadErr}</Text>
// //                 <TouchableOpacity style={st.retry} onPress={() => { play('btn'); load(); }}><Text style={st.retryT}>Try again</Text></TouchableOpacity>
// //                 <TouchableOpacity onPress={() => { play('btn'); onExit(); }}><Text style={st.back}>Back</Text></TouchableOpacity>
// //               </>
// //             ) : (
// //               <>
// //                 <ActivityIndicator size="large" color="#fff" />
// //                 <Text style={st.load}>Loading level 9...</Text>
// //               </>
// //             )}
// //           </View>
// //         </View>
// //       </Stage>
// //     );
// //   }

// //   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' } : {};
// //   const gx = pad + (view.goal % cols) * cs, gy = pad + Math.floor(view.goal / cols) * cs;

// //   return (
// //     <Stage bg={SKY}>
// //       <View style={st.root}>
// //         <Garden />
// //         {header}

// //         <View style={st.center}>
// //           {/* question pill */}
// //           <View style={st.qPill}>
// //             <Text style={st.qArrow}>{'<'}</Text>
// //             <Text style={[st.q, msg ? { color: '#c0392b' } : null]}>{msg || view.title}</Text>
// //             <Text style={st.qArrow}>{'>'}</Text>
// //           </View>

// //           {/* the maze: drag the dog to the bone */}
// //           <View style={[st.field, { width: FW, height: FH }]}>
// //             <View style={{ position: 'absolute', left: pad, top: pad, width: cols * cs, height: rows * cs }}>
// //               <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal} />
// //             </View>

// //             {/* dog house + bone at the goal */}
// //             <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.02, top: gy + cs * 0.02 }}><DogHouse w={cs * 0.96} /></View>
// //             <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.06, top: gy + cs * 0.66 }}><Bone w={cs * 0.8} /></View>

// //             {/* the dog */}
// //             <Animated.View pointerEvents="none"
// //               style={{ position: 'absolute', left: 0, top: 0, transform: [...dogPos.getTranslateTransform(), { translateY: hop }] }}>
// //               <Dog w={ds} />
// //             </Animated.View>

// //             <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
// //           </View>

// //           {/* arrow buttons (below the maze) */}
// //           <View style={st.dpad}>
// //             <TouchableOpacity style={[st.arrow, { left: 48, top: 0 }]} activeOpacity={0.8} onPress={() => step('U')}><Text style={st.arrowT}>▲</Text></TouchableOpacity>
// //             <TouchableOpacity style={[st.arrow, { left: 0, top: 26 }]} activeOpacity={0.8} onPress={() => step('L')}><Text style={st.arrowT}>◀</Text></TouchableOpacity>
// //             <TouchableOpacity style={[st.arrow, { left: 96, top: 26 }]} activeOpacity={0.8} onPress={() => step('R')}><Text style={st.arrowT}>▶</Text></TouchableOpacity>
// //             <TouchableOpacity style={[st.arrow, { left: 48, top: 52 }]} activeOpacity={0.8} onPress={() => step('D')}><Text style={st.arrowT}>▼</Text></TouchableOpacity>
// //           </View>
// //         </View>

// //         {/* bottom wooden panel (same as Level 5) */}
// //         <View style={st.panel}>
// //           <View style={[st.plank, { top: 18, left: 34, right: 34 }]} />
// //           <View style={[st.plank, { top: 76, left: 26, right: 26 }]} />
// //           <View style={[st.plank, { bottom: 16, left: 34, right: 34 }]} />
// //           <View style={[st.screw, { left: 16, top: 16 }]} />
// //           <View style={[st.screw, { right: 16, top: 16 }]} />
// //           <View style={[st.screw, { left: 16, bottom: 16 }]} />
// //           <View style={[st.screw, { right: 16, bottom: 16 }]} />

// //           <View style={st.btnCol}>
// //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
// //               <Icon n="search" s={40} />
// //             </TouchableOpacity>
// //             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>25</Text></View>
// //           </View>

// //           <View style={st.btnCol}>
// //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
// //               <Icon n="film" s={46} />
// //             </TouchableOpacity>
// //             <View style={st.badge}><Coin s={15} /><Text style={st.badgeT}>+75</Text></View>
// //           </View>

// //           <View style={st.btnCol}>
// //             <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
// //               <DoubleArrow s={42} />
// //             </TouchableOpacity>
// //             <View style={st.badge}><Icon n="bulb" s={19} /><Text style={st.badgeT}>50</Text></View>
// //           </View>
// //         </View>

// //         {/* CLUES popup (small board, text comes from the backend) */}
// //         {clueOpen && (
// //           <View style={st.overlay}>
// //             <View style={st.clueCard}>
// //               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
// //                 <Icon n="cross" s={14} />
// //               </TouchableOpacity>
// //               <Text style={st.clueTitle}>CLUES</Text>

// //               <View style={[st.clueRow, st.clueRowOpen]}>
// //                 <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
// //                 <View style={{ flex: 1 }}>
// //                   <Text style={st.clueHead}>Clue 1</Text>
// //                   <Text style={st.clueBody}>{clueText || CLUE_FALLBACK}</Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>
// //         )}

// //         {/* result card */}
// //         {!!result && (
// //           <View style={st.overlay}>
// //             <Animated.View style={[st.card, { opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
// //               <Text style={st.cardTitle}>Level complete!</Text>
// //               <Text style={st.cardMsg}>{result.message}</Text>
// //               <View style={st.stars}>{[1, 2, 3].map((n) => <BigStar key={n} s={46} on={n <= (result.stars || 0)} />)}</View>
// //               <Text style={st.cardScore}>Score {result.score}</Text>
// //               <TouchableOpacity style={st.next} activeOpacity={0.85} onPress={() => { play('btn'); onComplete ? onComplete(result) : onExit(); }}>
// //                 <Text style={st.nextT}>NEXT</Text>
// //               </TouchableOpacity>
// //             </Animated.View>
// //           </View>
// //         )}
// //       </View>
// //     </Stage>
// //   );
// // }

// // /* =========================================================
// //    STYLES (same as Level 5)
// // ========================================================= */

// // const st = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: SKY, overflow: 'hidden' },

// //   topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 14 },
// //   leftBtns: { flexDirection: 'row', gap: 8 },
// //   woodBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: YEL_BTN, borderWidth: 2.5, borderColor: YEL_BTN_D, alignItems: 'center', justifyContent: 'center', elevation: 3 },
// //   signWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
// //   sign: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 6, backgroundColor: '#bd6b29', borderWidth: 3, borderColor: WOOD_DD, elevation: 3 },
// //   signT: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
// //   signArrow: { fontFamily: FONT, fontSize: 22, fontWeight: '900', color: '#ffc533' },
// //   pillWrap: { minWidth: 100, height: 44, justifyContent: 'center' },
// //   pill: { height: 32, borderRadius: 16, backgroundColor: CREAM, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#d8c8a8', justifyContent: 'center', paddingLeft: 18, paddingRight: 30, elevation: 3 },
// //   pillT: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: '#1b1b1b' },
// //   pillIcon: { position: 'absolute', right: -6, top: -4 },

// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 170 },
// //   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
// //   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 10, maxWidth: 380, elevation: 3 },
// //   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
// //   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
// //   field: { backgroundColor: '#a6dd63', borderRadius: 12, borderWidth: 0 },

// //   dpad: { width: 140, height: DPAD_H, marginTop: 6 },
// //   arrow: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#3bb0d0', borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
// //   arrowT: { fontSize: 20, color: '#1b1b1b', fontWeight: '900' },

// //   // bottom wooden panel (solid wood, plank lines, corner rivets)
// //   panel: {
// //     position: 'absolute', left: 14, right: 14, bottom: 18, height: 148, borderRadius: 46,
// //     backgroundColor: WOOD, borderWidth: 6, borderColor: WOOD_D,
// //     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 20, elevation: 6,
// //   },
// //   plank: { position: 'absolute', height: 2.5, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
// //   screw: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: WOOD_DD },
// //   btnCol: { alignItems: 'center' },
// //   circleBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 7, alignItems: 'center', justifyContent: 'center', elevation: 6 },
// //   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8, minWidth: 76, paddingHorizontal: 12, height: 32, borderRadius: 16, backgroundColor: BADGE },
// //   badgeT: { fontFamily: FONT, fontSize: 17, fontWeight: '900', color: '#fff' },

// //   // CLUES board - small, like Level 5
// //   clueCard: { width: '70%', maxWidth: 270, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 4, borderRadius: 20, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4 },
// //   clueTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 8 },
// //   closeBtn: { position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: 14, backgroundColor: WOOD, borderWidth: 2.5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
// //   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, borderWidth: 2, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8 },
// //   clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
// //   clueNum: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
// //   clueNumT: { fontFamily: FONT, fontSize: 19, fontWeight: '900', color: '#fff' },
// //   clueHead: { fontFamily: FONT, fontSize: 15, fontWeight: '900', color: '#bd6b29' },
// //   clueBody: { fontFamily: SERIF, fontSize: 13, fontStyle: 'italic', color: '#17307a', marginTop: 1 },

// //   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,25,60,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
// //   card: { width: '82%', alignItems: 'center', backgroundColor: CREAM, borderWidth: 8, borderColor: WOOD_D, borderRadius: 28, padding: 20 },
// //   cardTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: NAVY },
// //   cardMsg: { fontFamily: SERIF, fontSize: 17, fontStyle: 'italic', color: '#17307a', textAlign: 'center', marginTop: 6 },
// //   stars: { flexDirection: 'row', gap: 6, marginTop: 14 },
// //   cardScore: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: '#bd6b29', marginTop: 10 },
// //   next: { marginTop: 18, minWidth: 170, height: 56, borderRadius: 28, backgroundColor: '#8fe62d', borderWidth: 4, borderColor: '#d6f58a', alignItems: 'center', justifyContent: 'center' },
// //   nextT: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: NAVY },

// //   load: { fontFamily: FONT, fontSize: 22, color: '#fff', marginTop: 12 },
// //   err: { fontFamily: FONT, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 24 },
// //   retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: LIME, borderWidth: 2.5, borderColor: '#1b1b1b' },
// //   retryT: { fontFamily: FONT, fontSize: 20, fontWeight: '800', color: '#1b1b1b' },
// //   back: { fontFamily: FONT, fontSize: 16, color: '#fff', marginTop: 14, textDecorationLine: 'underline' },
// // });
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, Animated, Easing, PanResponder, StyleSheet, ActivityIndicator, Platform, useWindowDimensions,
// } from 'react-native';
// import Svg, { Rect, Path, Circle, Ellipse, G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { Stage, F, Coin } from './BTShared';
// import { Icon } from './Art';
// import { BigStar } from './Btlevel5art';
// import { Maze, Dog, Bone, DogHouse, OPEN_N, OPEN_E, OPEN_S, OPEN_W } from './Btlevel9art';
// import { startLevel9, hintLevel9, finishLevel9, skipLevel9, rewardLevel9, Level9View, Level9Result } from './Btlevel9api';
// import { play } from './BTSound';

// const FONT: any = F;
// const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

// /* garden palette (same as Level 5) */
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

// // shown only if the server did not send a clue text
// const CLUE_FALLBACK = 'Find the correct path through the maze to help the dog reach its bone!';

// type Props = {
//   playerId: number;
//   hints?: number;
//   setHints?: (n: number) => void;
//   onExit: () => void;
//   onComplete?: (result: Level9Result) => void;
// };

// const PADC = 1.3;      // free board around the maze, in cells
// const DPAD_H = 96;     // height of the arrow buttons block

// /* ---------- garden background (same as Level 5) ---------- */
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
//           <LinearGradient id="g9sky" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0" stopColor="#46b6f3" />
//             <Stop offset="1" stopColor="#c2e8fb" />
//           </LinearGradient>
//         </Defs>
//         <Rect width="10" height="10" fill="url(#g9sky)" />
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

// export default function BTLevel9Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
//   const { width, height } = useWindowDimensions();
//   const RW = Math.min(width - 24, 360);            // field width limit
//   const IW = RW;

//   const [view, setView] = useState<Level9View | null>(null);
//   const [sessionId, setSessionId] = useState<number | null>(null);
//   const [loadErr, setLoadErr] = useState('');
//   const [msg, setMsg] = useState('');
//   const [done, setDone] = useState(false);
//   const [trail, setTrail] = useState<number[]>([]);
//   const [hintCells, setHintCells] = useState<number[]>([]);
//   const [result, setResult] = useState<Level9Result | null>(null);
//   const [confirmSkip, setConfirmSkip] = useState(false);
//   const [clueOpen, setClueOpen] = useState(false);
//   const [clueText, setClueText] = useState('');        // clue text that comes from the backend

//   const cols = view ? view.cols : 9;
//   const rows = view ? view.rows : 9;
//   const cs = Math.max(20, Math.floor(Math.min(IW / (cols + 2 * PADC), (height - 362 - (DPAD_H + 6)) / (rows + 2 * PADC))));   // one cell in pixels
//   const ds = cs * 0.9;                             // dog size
//   const pad = cs * PADC;                           // board around the maze
//   const FW = cols * cs + 2 * pad;                  // whole drag field
//   const FH = rows * cs + 2 * pad;

//   const dogPos = useRef(new Animated.ValueXY()).current;
//   const hop = useRef(new Animated.Value(0)).current;
//   const pop = useRef(new Animated.Value(0)).current;
//   const sway = useRef(new Animated.Value(0)).current;

//   const geo = useRef({ cs, cols, rows, ds, pad, FW, FH });
//   geo.current = { cs, cols, rows, ds, pad, FW, FH };
//   const startRef = useRef(0);
//   const outsideRef = useRef(false);                // the dog is on the board, outside the maze
//   const cellsRef = useRef<number[]>([]);
//   const goalRef = useRef(0);
//   const curRef = useRef(0);                        // the cell the dog stands on
//   const pathRef = useRef<number[]>([0]);           // start -> bone (free drag)
//   const dogC = useRef({ x: 0, y: 0 });             // dog centre in maze pixels
//   const touch = useRef({ on: false, sx: 0, sy: 0 });
//   const doneRef = useRef(false);
//   const sessionRef = useRef<number | null>(null);
//   const hintBusy = useRef(false);                  // a clue request is on its way
//   const timers = useRef<any[]>([]);
//   const msgTimer = useRef<any>(null);
//   const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

//   const flash = (m: string) => {
//     setMsg(m); clearTimeout(msgTimer.current);
//     msgTimer.current = setTimeout(() => setMsg(''), 2800);
//   };

//   // hanging sign sways gently (same as Level 5)
//   useEffect(() => {
//     const a = Animated.loop(Animated.sequence([
//       Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//     ]));
//     a.start();
//     return () => a.stop();
//   }, [sway]);
//   const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

//   // put the dog (by its centre) at a pixel of the maze
//   const moveDogTo = (x: number, y: number) => {
//     const q = geo.current;
//     dogC.current = { x, y };
//     dogPos.setValue({ x: x - q.ds / 2, y: y - q.ds / 2 });
//   };

//   // centre pixel of a cell
//   const centreOf = (c: number) => {
//     const g = geo.current;
//     return { x: g.pad + (c % g.cols + 0.5) * g.cs, y: g.pad + (Math.floor(c / g.cols) + 0.5) * g.cs };
//   };

//   // 1. open the level - the backend builds a NEW maze every time
//   const load = useCallback(() => {
//     setLoadErr(''); setView(null);
//     startLevel9(playerId)
//       .then((v) => {
//         cellsRef.current = v.cells;
//         goalRef.current = v.goal;
//         curRef.current = v.start;
//         pathRef.current = [v.start];
//         doneRef.current = false;
//         touch.current = { on: false, sx: 0, sy: 0 };
//         startRef.current = v.start;
//         outsideRef.current = false;
//         const g = geo.current;
//         dogC.current = { x: g.pad + (v.start % v.cols + 0.5) * g.cs, y: g.pad + (Math.floor(v.start / v.cols) + 0.5) * g.cs };
//         setDone(false); setResult(null); setHintCells([]); setTrail([v.start]);
//         setClueOpen(false); setClueText('');
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

//   // when the maze appears or the size changes, keep the dog on the same spot (scaled)
//   const lastCs = useRef(cs);
//   useEffect(() => {
//     if (!view) return;
//     if (lastCs.current !== cs) {
//       const k = cs / lastCs.current;
//       dogC.current = { x: dogC.current.x * k, y: dogC.current.y * k };
//       lastCs.current = cs;
//     }
//     moveDogTo(dogC.current.x, dogC.current.y);
//   }, [view, cs]);                                  // eslint-disable-line react-hooks/exhaustive-deps

//   // level complete -> card pops in + sound
//   useEffect(() => {
//     if (result) {
//       play('correct');
//       Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
//     }
//   }, [result]);

//   // 2. the dog reached the bone: tell the backend, it saves the win
//   const finish = async (attempt: number) => {
//     const sid = sessionRef.current;
//     if (!sid) return;
//     try {
//       const path = pathRef.current.slice();
//       const r = await finishLevel9({ sessionId: sid, playerId, path, moves: Math.max(1, path.length - 1) });
//       if (setHints && typeof r.hints === 'number') setHints(r.hints);
//       setDone(true);
//       Animated.sequence([
//         Animated.timing(hop, { toValue: -14, duration: 160, useNativeDriver: true }),
//         Animated.timing(hop, { toValue: 0, duration: 160, useNativeDriver: true }),
//         Animated.timing(hop, { toValue: -10, duration: 140, useNativeDriver: true }),
//         Animated.timing(hop, { toValue: 0, duration: 140, useNativeDriver: true }),
//       ]).start();
//       later(() => setResult(r), 1300);
//     } catch (e: any) {
//       if (attempt < 2) { later(() => finishRef.current(attempt + 1), 1200); return; }
//       doneRef.current = false;
//       flash(e.message || 'Network error. Move the dog a little and come back.');
//     }
//   };
//   const finishRef = useRef(finish);
//   finishRef.current = finish;

//   // which maze cell is under a pixel of the field (-1 = on the board outside the maze)
//   const cellAt = (x: number, y: number) => {
//     const q = geo.current;
//     const mx = x - q.pad, my = y - q.pad;
//     if (mx < 0 || my < 0 || mx >= q.cols * q.cs || my >= q.rows * q.cs) return -1;
//     return Math.floor(my / q.cs) * q.cols + Math.floor(mx / q.cs);
//   };

//   // can the dog step from (ox,oy) to (nx,ny)?
//   //  - inside the maze: only through open sides (walls block the dog)
//   //  - outside the maze: free, but it cannot cut through the maze walls
//   //  - the only gates: top of the start cell and bottom of the goal cell
//   const stand = (ox: number, oy: number, nx: number, ny: number) => {
//     const q = geo.current, cells = cellsRef.current;
//     if (nx < q.ds / 2 || nx > q.FW - q.ds / 2 || ny < q.ds / 2 || ny > q.FH - q.ds / 2) return false;
//     const mx0 = q.pad, my0 = q.pad, mx1 = q.pad + q.cols * q.cs, my1 = q.pad + q.rows * q.cs;
//     const oc = cellAt(ox, oy), nc = cellAt(nx, ny);

//     if (oc >= 0 && nc >= 0) {                                 // inside -> inside
//       if (oc === nc) return true;
//       const dx = (nc % q.cols) - (oc % q.cols), dy = Math.floor(nc / q.cols) - Math.floor(oc / q.cols);
//       if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
//       const bit = dx > 0 ? OPEN_E : dx < 0 ? OPEN_W : dy > 0 ? OPEN_S : OPEN_N;
//       return !!(cells[oc] & bit);
//     }
//     if (oc < 0 && nc < 0) {                                   // outside -> outside
//       const B = q.ds * 0.5;                                   // keep the dog off the outer wall
//       const near = nx > mx0 - B && nx < mx1 + B && ny > my0 - B && ny < my1 + B;
//       if (!near) return true;
//       const startGate = nx >= mx0 && nx < mx0 + q.cs && ny < my0;
//       const goalGate = nx >= mx1 - q.cs && nx < mx1 && ny >= my1;
//       return startGate || goalGate;
//     }
//     if (oc < 0) {                                             // outside -> inside
//       if (nc === startRef.current && oy < my0) return true;
//       if (nc === goalRef.current && oy >= my1) return true;
//       return false;
//     }
//     if (oc === startRef.current && ny < my0) return true;     // inside -> outside
//     if (oc === goalRef.current && ny >= my1) return true;
//     return false;
//   };

//   // common logic after the dog moved (drag AND arrow buttons)
//   const afterMove = (x: number, y: number) => {
//     const q = geo.current;
//     moveDogTo(x, y);

//     const cell = cellAt(x, y);
//     outsideRef.current = cell < 0;
//     if (cell >= 0 && cell !== curRef.current) {
//       curRef.current = cell;
//       const p = pathRef.current;
//       if (p.length > 1 && p[p.length - 2] === cell) p.pop(); else p.push(cell);
//       setTrail(p.slice());
//     }

//     // win: the dog reaches the bone. From the board outside, getting close to the bone house is enough.
//     const gp = centreOf(goalRef.current);
//     const nearBone = cell < 0 && Math.hypot(x - gp.x, y - gp.y) <= q.cs * 1.4;
//     if (nearBone || (cell >= 0 && cell === goalRef.current)) {
//       doneRef.current = true;
//       touch.current.on = false;
//       setConfirmSkip(false);
//       moveDogTo(gp.x, gp.y);                                  // snap to the bone
//       finishRef.current(0);
//     }
//   };

//   // arrow buttons: one cell per tap (inside the maze), half a cell (outside on the board)
//   const step = (dir: 'U' | 'D' | 'L' | 'R') => {
//     if (doneRef.current || !sessionRef.current) return;
//     play('tap');
//     setConfirmSkip(false);
//     const q = geo.current, d = dogC.current;
//     const dx = dir === 'L' ? -1 : dir === 'R' ? 1 : 0, dy = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;
//     const oc = cellAt(d.x, d.y);
//     let tx: number, ty: number;
//     if (oc >= 0) { const c = centreOf(oc); tx = c.x + dx * q.cs; ty = c.y + dy * q.cs; }
//     else { tx = d.x + dx * q.cs * 0.5; ty = d.y + dy * q.cs * 0.5; }
//     let x = d.x, y = d.y;
//     const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
//     const sx = (tx - x) / n, sy = (ty - y) / n;
//     for (let i = 0; i < n; i += 1) {
//       if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
//       else if (oc < 0 && stand(x, y, x + sx, y)) { x += sx; }
//       else if (oc < 0 && stand(x, y, x, y + sy)) { y += sy; }
//       else break;
//     }
//     if (oc >= 0 && Math.hypot(tx - x, ty - y) > 1) return;   // wall blocked
//     if (x === d.x && y === d.y) return;
//     afterMove(x, y);
//   };

//   // grab the dog and drag it. Walls block it inside the maze, so the way to the bone is OUTSIDE.
//   const pan = useRef(PanResponder.create({
//     onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
//     onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
//     onPanResponderTerminationRequest: () => false,
//     onPanResponderGrant: (e) => {
//       const q = geo.current, c = dogC.current;
//       const d = Math.hypot(e.nativeEvent.locationX - c.x, e.nativeEvent.locationY - c.y);
//       touch.current = { on: d <= q.cs * 1.1, sx: c.x, sy: c.y };   // touch must start on the dog
//       setConfirmSkip(false);
//     },
//     onPanResponderMove: (_e, g) => {
//       const t = touch.current;
//       if (doneRef.current || !t.on) return;
//       const q = geo.current, d = dogC.current;

//       // where the finger wants the dog (the finger never runs more than ~1 cell ahead of a blocked dog)
//       let tx = t.sx + g.dx, ty = t.sy + g.dy;
//       const ox = tx - d.x, oy = ty - d.y, len = Math.hypot(ox, oy), lim = q.cs * 1.2;
//       if (len > lim) { const k = (len - lim) / len; t.sx -= ox * k; t.sy -= oy * k; tx -= ox * k; ty -= oy * k; }

//       // walk in small steps so a fast swipe cannot jump over a wall; slide along walls
//       let x = d.x, y = d.y;
//       const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
//       const sx = (tx - x) / n, sy = (ty - y) / n;
//       for (let i = 0; i < n; i += 1) {
//         if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
//         else if (stand(x, y, x + sx, y)) { x += sx; }
//         else if (stand(x, y, x, y + sy)) { y += sy; }
//       }
//       if (x === d.x && y === d.y) return;
//       afterMove(x, y);
//     },
//     onPanResponderRelease: () => { touch.current.on = false; },
//     onPanResponderTerminate: () => { touch.current.on = false; },
//   })).current;

//   // magnifier (FREE clue): the request goes to the backend, the backend saves it in the database
//   // and answers in JSON { clue, path, hints, cost }. No hints / coins are taken.
//   const onHint = async () => {
//     if (done || !sessionId || hintBusy.current) return;
//     setConfirmSkip(false);
//     hintBusy.current = true;
//     try {
//       const r = await hintLevel9({
//         sessionId,
//         playerId,
//         cell: outsideRef.current ? -1 : curRef.current,
//       });
//       if (setHints && typeof r.hints === 'number') setHints(r.hints);
//       setHintCells(Array.isArray(r.path) ? r.path : []);
//       setClueText(r.clue || CLUE_FALLBACK);
//       play('clue');
//       setClueOpen(true);
//     } catch (e: any) {
//       play('wrong');
//       flash(e.message || 'Network error');
//     } finally {
//       hintBusy.current = false;
//     }
//   };

//   // video reward (+75 hints)
//   const onReward = async () => {
//     if (done) return;
//     play('btn');
//     setConfirmSkip(false);
//     try {
//       const r = await rewardLevel9(playerId);
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
//       const r = await skipLevel9({ sessionId, playerId });
//       setHints && setHints(r.hints || 0);
//       doneRef.current = true;
//       onComplete ? onComplete(r) : onExit();
//     } catch (e: any) {
//       setConfirmSkip(false);
//       play('wrong');
//       flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
//     }
//   };

//   /* ---------- header (same as Level 5) ---------- */
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
//           <Text style={st.signT}>LEVEL 9</Text>
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
//                 <Text style={st.load}>Loading level 9...</Text>
//               </>
//             )}
//           </View>
//         </View>
//       </Stage>
//     );
//   }

//   const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' } : {};
//   const gx = pad + (view.goal % cols) * cs, gy = pad + Math.floor(view.goal / cols) * cs;

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

//           {/* the maze: drag the dog to the bone */}
//           <View style={[st.field, { width: FW, height: FH }]}>
//             <View style={{ position: 'absolute', left: pad, top: pad, width: cols * cs, height: rows * cs }}>
//               <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal} />
//             </View>

//             {/* dog house + bone at the goal */}
//             <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.02, top: gy + cs * 0.02 }}><DogHouse w={cs * 0.96} /></View>
//             <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.06, top: gy + cs * 0.66 }}><Bone w={cs * 0.8} /></View>

//             {/* the dog */}
//             <Animated.View pointerEvents="none"
//               style={{ position: 'absolute', left: 0, top: 0, transform: [...dogPos.getTranslateTransform(), { translateY: hop }] }}>
//               <Dog w={ds} />
//             </Animated.View>

//             <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
//           </View>

//           {/* arrow buttons (below the maze) */}
//           <View style={st.dpad}>
//             <TouchableOpacity style={[st.arrow, { left: 48, top: 0 }]} activeOpacity={0.8} onPress={() => step('U')}><Text style={st.arrowT}>▲</Text></TouchableOpacity>
//             <TouchableOpacity style={[st.arrow, { left: 0, top: 26 }]} activeOpacity={0.8} onPress={() => step('L')}><Text style={st.arrowT}>◀</Text></TouchableOpacity>
//             <TouchableOpacity style={[st.arrow, { left: 96, top: 26 }]} activeOpacity={0.8} onPress={() => step('R')}><Text style={st.arrowT}>▶</Text></TouchableOpacity>
//             <TouchableOpacity style={[st.arrow, { left: 48, top: 52 }]} activeOpacity={0.8} onPress={() => step('D')}><Text style={st.arrowT}>▼</Text></TouchableOpacity>
//           </View>
//         </View>

//         {/* bottom wooden panel - small, like Level 5 */}
//         <View style={st.panel}>
//           <View style={[st.plank, { top: 14, left: 30, right: 30 }]} />
//           <View style={[st.plank, { top: 62, left: 24, right: 24 }]} />
//           <View style={[st.plank, { bottom: 12, left: 30, right: 30 }]} />
//           <View style={[st.screw, { left: 14, top: 14 }]} />
//           <View style={[st.screw, { right: 14, top: 14 }]} />
//           <View style={[st.screw, { left: 14, bottom: 12 }]} />
//           <View style={[st.screw, { right: 14, bottom: 12 }]} />

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: LIME, borderColor: LIME_RING }]} activeOpacity={0.85} onPress={onHint}>
//               <Icon n="search" s={32} />
//             </TouchableOpacity>
//             <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: '#f7ebd4', borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onReward}>
//               <Icon n="film" s={38} />
//             </TouchableOpacity>
//             <View style={st.badge}><Coin s={13} /><Text style={st.badgeT}>+75</Text></View>
//           </View>

//           <View style={st.btnCol}>
//             <TouchableOpacity style={[st.circleBtn, { backgroundColor: RED, borderColor: '#fbf3e3' }]} activeOpacity={0.85} onPress={onSkip}>
//               <DoubleArrow s={34} />
//             </TouchableOpacity>
//             <View style={st.badge}><Icon n="bulb" s={16} /><Text style={st.badgeT}>50</Text></View>
//           </View>
//         </View>

//         {/* CLUES popup (small board, text comes from the backend) */}
//         {clueOpen && (
//           <View style={st.overlay}>
//             <View style={st.clueCard}>
//               <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
//                 <Icon n="cross" s={14} />
//               </TouchableOpacity>
//               <Text style={st.clueTitle}>HINTS</Text>

//               <View style={[st.clueRow, st.clueRowOpen]}>
//                 <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={st.clueHead}>Hint 1</Text>
//                   <Text style={st.clueBody}>{clueText || CLUE_FALLBACK}</Text>
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
//    STYLES (same as Level 5)
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

//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 140 },
//   centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
//   qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 10, maxWidth: 380, elevation: 3 },
//   qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
//   q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
//   field: { backgroundColor: '#a6dd63', borderRadius: 12, borderWidth: 0 },

//   dpad: { width: 140, height: DPAD_H, marginTop: 6 },
//   arrow: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#3bb0d0', borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
//   arrowT: { fontSize: 20, color: '#1b1b1b', fontWeight: '900' },

//   // bottom wooden panel - small like Level 5 (solid wood, plank lines, corner rivets)
//   panel: {
//     position: 'absolute', left: 22, right: 22, bottom: 16, height: 116, borderRadius: 36,
//     backgroundColor: WOOD, borderWidth: 5, borderColor: WOOD_D,
//     flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 14, elevation: 6,
//   },
//   plank: { position: 'absolute', height: 2, borderRadius: 2, backgroundColor: '#d58f3a', opacity: 0.7 },
//   screw: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: WOOD_DD },
//   btnCol: { alignItems: 'center' },
//   circleBtn: { width: 62, height: 62, borderRadius: 31, borderWidth: 5, alignItems: 'center', justifyContent: 'center', elevation: 6 },
//   badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 6, minWidth: 64, paddingHorizontal: 10, height: 26, borderRadius: 13, backgroundColor: BADGE },
//   badgeT: { fontFamily: FONT, fontSize: 15, fontWeight: '900', color: '#fff' },

//   // CLUES board - small, like Level 5
//   clueCard: { width: '70%', maxWidth: 270, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 4, borderRadius: 20, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4 },
//   clueTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 8 },
//   closeBtn: { position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: 14, backgroundColor: WOOD, borderWidth: 2.5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
//   clueRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, borderWidth: 2, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8 },
//   clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
//   clueNum: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
//   clueNumT: { fontFamily: FONT, fontSize: 19, fontWeight: '900', color: '#fff' },
//   clueHead: { fontFamily: FONT, fontSize: 15, fontWeight: '900', color: '#bd6b29' },
//   clueBody: { fontFamily: SERIF, fontSize: 13, fontStyle: 'italic', color: '#17307a', marginTop: 1 },

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
import { Maze, Dog, Bone, DogHouse, OPEN_N, OPEN_E, OPEN_S, OPEN_W } from './Btlevel9art';
import { startLevel9, hintLevel9, finishLevel9, skipLevel9, rewardLevel9, Level9View, Level9Result } from './Btlevel9api';
import { play } from './BTSound';

const FONT: any = F;
const SERIF: any = Platform.select({ web: '"Playfair Display",Georgia,"Times New Roman",serif', ios: 'Georgia-Italic', default: 'serif' });

/* garden palette (same as Level 5) */
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

// shown only if the server did not send a clue text
const CLUE_FALLBACK = 'Move the dog into the house';

type Props = {
  playerId: number;
  hints?: number;
  setHints?: (n: number) => void;
  onExit: () => void;
  onComplete?: (result: Level9Result) => void;
};

const PADC = 1.3;      // free board around the maze, in cells
const DPAD_H = 96;     // height of the arrow buttons block

/* ---------- garden background (same as Level 5) ---------- */
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
          <LinearGradient id="g9sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#46b6f3" />
            <Stop offset="1" stopColor="#c2e8fb" />
          </LinearGradient>
        </Defs>
        <Rect width="10" height="10" fill="url(#g9sky)" />
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

export default function BTLevel9Screen({ playerId, hints = 0, setHints, onExit, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const RW = Math.min(width - 24, 360);            // field width limit
  const IW = RW;

  const [view, setView] = useState<Level9View | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(false);
  const [trail, setTrail] = useState<number[]>([]);
  const [hintCells, setHintCells] = useState<number[]>([]);
  const [result, setResult] = useState<Level9Result | null>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [clueOpen, setClueOpen] = useState(false);
  const [clueText, setClueText] = useState('');        // clue text that comes from the backend

  const cols = view ? view.cols : 9;
  const rows = view ? view.rows : 9;
  const cs = Math.max(20, Math.floor(Math.min(IW / (cols + 2 * PADC), (height - 362 - (DPAD_H + 6)) / (rows + 2 * PADC))));   // one cell in pixels
  const ds = cs * 0.9;                             // dog size
  const pad = cs * PADC;                           // board around the maze
  const FW = cols * cs + 2 * pad;                  // whole drag field
  const FH = rows * cs + 2 * pad;

  const dogPos = useRef(new Animated.ValueXY()).current;
  const hop = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  const geo = useRef({ cs, cols, rows, ds, pad, FW, FH });
  geo.current = { cs, cols, rows, ds, pad, FW, FH };
  const startRef = useRef(0);
  const outsideRef = useRef(false);                // the dog is on the board, outside the maze
  const cellsRef = useRef<number[]>([]);
  const goalRef = useRef(0);
  const curRef = useRef(0);                        // the cell the dog stands on
  const pathRef = useRef<number[]>([0]);           // start -> bone (free drag)
  const dogC = useRef({ x: 0, y: 0 });             // dog centre in maze pixels
  const touch = useRef({ on: false, sx: 0, sy: 0 });
  const doneRef = useRef(false);
  const sessionRef = useRef<number | null>(null);
  const hintBusy = useRef(false);                  // a clue request is on its way
  const timers = useRef<any[]>([]);
  const msgTimer = useRef<any>(null);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const flash = (m: string) => {
    setMsg(m); clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(''), 2800);
  };

  // hanging sign sways gently (same as Level 5)
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [sway]);
  const swayR = sway.interpolate({ inputRange: [0, 1], outputRange: ['-1.5deg', '1.5deg'] });

  // put the dog (by its centre) at a pixel of the maze
  const moveDogTo = (x: number, y: number) => {
    const q = geo.current;
    dogC.current = { x, y };
    dogPos.setValue({ x: x - q.ds / 2, y: y - q.ds / 2 });
  };

  // centre pixel of a cell
  const centreOf = (c: number) => {
    const g = geo.current;
    return { x: g.pad + (c % g.cols + 0.5) * g.cs, y: g.pad + (Math.floor(c / g.cols) + 0.5) * g.cs };
  };

  // 1. open the level - the backend builds a NEW maze every time
  const load = useCallback(() => {
    setLoadErr(''); setView(null);
    startLevel9(playerId)
      .then((v) => {
        cellsRef.current = v.cells;
        goalRef.current = v.goal;
        curRef.current = v.start;
        pathRef.current = [v.start];
        doneRef.current = false;
        touch.current = { on: false, sx: 0, sy: 0 };
        startRef.current = v.start;
        outsideRef.current = false;
        const g = geo.current;
        dogC.current = { x: g.pad + (v.start % v.cols + 0.5) * g.cs, y: g.pad + (Math.floor(v.start / v.cols) + 0.5) * g.cs };
        setDone(false); setResult(null); setHintCells([]); setTrail([v.start]);
        setClueOpen(false); setClueText('');
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

  // when the maze appears or the size changes, keep the dog on the same spot (scaled)
  const lastCs = useRef(cs);
  useEffect(() => {
    if (!view) return;
    if (lastCs.current !== cs) {
      const k = cs / lastCs.current;
      dogC.current = { x: dogC.current.x * k, y: dogC.current.y * k };
      lastCs.current = cs;
    }
    moveDogTo(dogC.current.x, dogC.current.y);
  }, [view, cs]);                                  // eslint-disable-line react-hooks/exhaustive-deps

  // level complete -> card pops in + sound
  useEffect(() => {
    if (result) {
      play('correct');
      Animated.spring(pop, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
    }
  }, [result]);

  // 2. the dog reached the bone: tell the backend, it saves the win
  const finish = async (attempt: number) => {
    const sid = sessionRef.current;
    if (!sid) return;
    try {
      const path = pathRef.current.slice();
      const r = await finishLevel9({ sessionId: sid, playerId, path, moves: Math.max(1, path.length - 1) });
      if (setHints && typeof r.hints === 'number') setHints(r.hints);
      setDone(true);
      Animated.sequence([
        Animated.timing(hop, { toValue: -14, duration: 160, useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(hop, { toValue: -10, duration: 140, useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 140, useNativeDriver: true }),
      ]).start();
      later(() => setResult(r), 1300);
    } catch (e: any) {
      if (attempt < 2) { later(() => finishRef.current(attempt + 1), 1200); return; }
      doneRef.current = false;
      flash(e.message || 'Network error. Move the dog a little and come back.');
    }
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  // which maze cell is under a pixel of the field (-1 = on the board outside the maze)
  const cellAt = (x: number, y: number) => {
    const q = geo.current;
    const mx = x - q.pad, my = y - q.pad;
    if (mx < 0 || my < 0 || mx >= q.cols * q.cs || my >= q.rows * q.cs) return -1;
    return Math.floor(my / q.cs) * q.cols + Math.floor(mx / q.cs);
  };

  // can the dog step from (ox,oy) to (nx,ny)?
  //  - inside the maze: only through open sides (walls block the dog)
  //  - outside the maze: free, but it cannot cut through the maze walls
  //  - the only gates: top of the start cell and bottom of the goal cell
  const stand = (ox: number, oy: number, nx: number, ny: number) => {
    const q = geo.current, cells = cellsRef.current;
    if (nx < q.ds / 2 || nx > q.FW - q.ds / 2 || ny < q.ds / 2 || ny > q.FH - q.ds / 2) return false;
    const mx0 = q.pad, my0 = q.pad, mx1 = q.pad + q.cols * q.cs, my1 = q.pad + q.rows * q.cs;
    const oc = cellAt(ox, oy), nc = cellAt(nx, ny);

    if (oc >= 0 && nc >= 0) {                                 // inside -> inside
      if (oc === nc) return true;
      const dx = (nc % q.cols) - (oc % q.cols), dy = Math.floor(nc / q.cols) - Math.floor(oc / q.cols);
      if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
      const bit = dx > 0 ? OPEN_E : dx < 0 ? OPEN_W : dy > 0 ? OPEN_S : OPEN_N;
      return !!(cells[oc] & bit);
    }
    if (oc < 0 && nc < 0) {                                   // outside -> outside
      const B = q.ds * 0.5;                                   // keep the dog off the outer wall
      const near = nx > mx0 - B && nx < mx1 + B && ny > my0 - B && ny < my1 + B;
      if (!near) return true;
      const startGate = nx >= mx0 && nx < mx0 + q.cs && ny < my0;
      const goalGate = nx >= mx1 - q.cs && nx < mx1 && ny >= my1;
      return startGate || goalGate;
    }
    if (oc < 0) {                                             // outside -> inside
      if (nc === startRef.current && oy < my0) return true;
      if (nc === goalRef.current && oy >= my1) return true;
      return false;
    }
    if (oc === startRef.current && ny < my0) return true;     // inside -> outside
    if (oc === goalRef.current && ny >= my1) return true;
    return false;
  };

  // common logic after the dog moved (drag AND arrow buttons)
  const afterMove = (x: number, y: number) => {
    const q = geo.current;
    moveDogTo(x, y);

    const cell = cellAt(x, y);
    outsideRef.current = cell < 0;
    if (cell >= 0 && cell !== curRef.current) {
      curRef.current = cell;
      const p = pathRef.current;
      if (p.length > 1 && p[p.length - 2] === cell) p.pop(); else p.push(cell);
      setTrail(p.slice());
    }

    // win: the dog reaches the bone. From the board outside, getting close to the bone house is enough.
    const gp = centreOf(goalRef.current);
    const nearBone = cell < 0 && Math.hypot(x - gp.x, y - gp.y) <= q.cs * 1.4;
    if (nearBone || (cell >= 0 && cell === goalRef.current)) {
      doneRef.current = true;
      touch.current.on = false;
      setConfirmSkip(false);
      moveDogTo(gp.x, gp.y);                                  // snap to the bone
      finishRef.current(0);
    }
  };

  // arrow buttons: one cell per tap (inside the maze), half a cell (outside on the board)
  const step = (dir: 'U' | 'D' | 'L' | 'R') => {
    if (doneRef.current || !sessionRef.current) return;
    play('tap');
    setConfirmSkip(false);
    const q = geo.current, d = dogC.current;
    const dx = dir === 'L' ? -1 : dir === 'R' ? 1 : 0, dy = dir === 'U' ? -1 : dir === 'D' ? 1 : 0;
    const oc = cellAt(d.x, d.y);
    let tx: number, ty: number;
    if (oc >= 0) { const c = centreOf(oc); tx = c.x + dx * q.cs; ty = c.y + dy * q.cs; }
    else { tx = d.x + dx * q.cs * 0.5; ty = d.y + dy * q.cs * 0.5; }
    let x = d.x, y = d.y;
    const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
    const sx = (tx - x) / n, sy = (ty - y) / n;
    for (let i = 0; i < n; i += 1) {
      if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
      else if (oc < 0 && stand(x, y, x + sx, y)) { x += sx; }
      else if (oc < 0 && stand(x, y, x, y + sy)) { y += sy; }
      else break;
    }
    if (oc >= 0 && Math.hypot(tx - x, ty - y) > 1) return;   // wall blocked
    if (x === d.x && y === d.y) return;
    afterMove(x, y);
  };

  // grab the dog and drag it. Walls block it inside the maze, so the way to the bone is OUTSIDE.
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
    onMoveShouldSetPanResponder: () => !doneRef.current && !!sessionRef.current,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: (e) => {
      const q = geo.current, c = dogC.current;
      const d = Math.hypot(e.nativeEvent.locationX - c.x, e.nativeEvent.locationY - c.y);
      touch.current = { on: d <= q.cs * 1.1, sx: c.x, sy: c.y };   // touch must start on the dog
      setConfirmSkip(false);
    },
    onPanResponderMove: (_e, g) => {
      const t = touch.current;
      if (doneRef.current || !t.on) return;
      const q = geo.current, d = dogC.current;

      // where the finger wants the dog (the finger never runs more than ~1 cell ahead of a blocked dog)
      let tx = t.sx + g.dx, ty = t.sy + g.dy;
      const ox = tx - d.x, oy = ty - d.y, len = Math.hypot(ox, oy), lim = q.cs * 1.2;
      if (len > lim) { const k = (len - lim) / len; t.sx -= ox * k; t.sy -= oy * k; tx -= ox * k; ty -= oy * k; }

      // walk in small steps so a fast swipe cannot jump over a wall; slide along walls
      let x = d.x, y = d.y;
      const n = Math.max(1, Math.ceil(Math.hypot(tx - x, ty - y) / (q.cs / 6)));
      const sx = (tx - x) / n, sy = (ty - y) / n;
      for (let i = 0; i < n; i += 1) {
        if (stand(x, y, x + sx, y + sy)) { x += sx; y += sy; }
        else if (stand(x, y, x + sx, y)) { x += sx; }
        else if (stand(x, y, x, y + sy)) { y += sy; }
      }
      if (x === d.x && y === d.y) return;
      afterMove(x, y);
    },
    onPanResponderRelease: () => { touch.current.on = false; },
    onPanResponderTerminate: () => { touch.current.on = false; },
  })).current;

  // magnifier (FREE clue): the request goes to the backend, the backend saves it in the database
  // and answers in JSON { clue, path, hints, cost }. No hints / coins are taken.
  const onHint = async () => {
    if (done || !sessionId || hintBusy.current) return;
    setConfirmSkip(false);
    hintBusy.current = true;
    try {
      const r = await hintLevel9({
        sessionId,
        playerId,
        cell: outsideRef.current ? -1 : curRef.current,
      });
      if (setHints && typeof r.hints === 'number') setHints(r.hints);
      setHintCells(Array.isArray(r.path) ? r.path : []);
      setClueText(r.clue || CLUE_FALLBACK);
      play('clue');
      setClueOpen(true);
    } catch (e: any) {
      play('wrong');
      flash(e.message || 'Network error');
    } finally {
      hintBusy.current = false;
    }
  };

  // video reward (+75 hints)
  const onReward = async () => {
    if (done) return;
    play('btn');
    setConfirmSkip(false);
    try {
      const r = await rewardLevel9(playerId);
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
      const r = await skipLevel9({ sessionId, playerId });
      setHints && setHints(r.hints || 0);
      doneRef.current = true;
      onComplete ? onComplete(r) : onExit();
    } catch (e: any) {
      setConfirmSkip(false);
      play('wrong');
      flash(e.status === 402 ? 'Not enough hints' : e.message || 'Network error');
    }
  };

  /* ---------- header (same as Level 5) ---------- */
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
          <Text style={st.signT}>LEVEL 9</Text>
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
                <Text style={st.load}>Loading level 9...</Text>
              </>
            )}
          </View>
        </View>
      </Stage>
    );
  }

  const webTouch: any = Platform.OS === 'web' ? { touchAction: 'none', userSelect: 'none', cursor: 'grab' } : {};
  const gx = pad + (view.goal % cols) * cs, gy = pad + Math.floor(view.goal / cols) * cs;

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

          {/* the maze: drag the dog to the bone */}
          <View style={[st.field, { width: FW, height: FH }]}>
            <View style={{ position: 'absolute', left: pad, top: pad, width: cols * cs, height: rows * cs }}>
              <Maze cells={view.cells} cols={cols} rows={rows} cs={cs} trail={trail} hint={hintCells} goal={view.goal} />
            </View>

            {/* dog house + bone at the goal */}
            <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.02, top: gy + cs * 0.02 }}><DogHouse w={cs * 0.96} /></View>
            <View pointerEvents="none" style={{ position: 'absolute', left: gx + cs * 0.06, top: gy + cs * 0.66 }}><Bone w={cs * 0.8} /></View>

            {/* the dog */}
            <Animated.View pointerEvents="none"
              style={{ position: 'absolute', left: 0, top: 0, transform: [...dogPos.getTranslateTransform(), { translateY: hop }] }}>
              <Dog w={ds} />
            </Animated.View>

            <View {...pan.panHandlers} style={[StyleSheet.absoluteFill, webTouch]} />
          </View>

          {/* arrow buttons (below the maze) */}
          <View style={st.dpad}>
            <TouchableOpacity style={[st.arrow, { left: 48, top: 0 }]} activeOpacity={0.8} onPress={() => step('U')}><Text style={st.arrowT}>▲</Text></TouchableOpacity>
            <TouchableOpacity style={[st.arrow, { left: 0, top: 26 }]} activeOpacity={0.8} onPress={() => step('L')}><Text style={st.arrowT}>◀</Text></TouchableOpacity>
            <TouchableOpacity style={[st.arrow, { left: 96, top: 26 }]} activeOpacity={0.8} onPress={() => step('R')}><Text style={st.arrowT}>▶</Text></TouchableOpacity>
            <TouchableOpacity style={[st.arrow, { left: 48, top: 52 }]} activeOpacity={0.8} onPress={() => step('D')}><Text style={st.arrowT}>▼</Text></TouchableOpacity>
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
            <View style={st.badge}><Text style={st.badgeT}>FREE</Text></View>
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

        {/* CLUES popup (small board, text comes from the backend) */}
        {clueOpen && (
          <View style={st.overlay}>
            <View style={st.clueCard}>
              <TouchableOpacity style={st.closeBtn} activeOpacity={0.85} onPress={() => { play('btn'); setClueOpen(false); }}>
                <Icon n="cross" s={14} />
              </TouchableOpacity>
              <Text style={st.clueTitle}>HINTS</Text>

              <View style={[st.clueRow, st.clueRowOpen]}>
                <View style={st.clueNum}><Text style={st.clueNumT}>1</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={st.clueHead}>Hint 1</Text>
                  <Text style={st.clueBody}>{clueText || CLUE_FALLBACK}</Text>
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
   STYLES (same as Level 5)
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

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingBottom: 140 },
  centerMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  qPill: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CREAM, borderRadius: 32, borderWidth: 2.5, borderColor: CREAM_BORDER, paddingVertical: 10, paddingHorizontal: 18, marginBottom: 10, maxWidth: 380, elevation: 3 },
  qArrow: { fontFamily: FONT, fontSize: 26, fontWeight: '900', color: ARROW },
  q: { flexShrink: 1, fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#17307a', textAlign: 'center' },
  field: { backgroundColor: '#a6dd63', borderRadius: 12, borderWidth: 0 },

  dpad: { width: 140, height: DPAD_H, marginTop: 6 },
  arrow: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#3bb0d0', borderWidth: 3, borderColor: '#1b1b1b', alignItems: 'center', justifyContent: 'center' },
  arrowT: { fontSize: 20, color: '#1b1b1b', fontWeight: '900' },

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

  // CLUES board - small, like Level 5
  clueCard: { width: '70%', maxWidth: 270, backgroundColor: CREAM, borderColor: WOOD_D, borderWidth: 4, borderRadius: 20, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4 },
  clueTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 8 },
  closeBtn: { position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: 14, backgroundColor: WOOD, borderWidth: 2.5, borderColor: WOOD_D, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  clueRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 16, borderWidth: 2, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8 },
  clueRowOpen: { backgroundColor: '#fff', borderColor: GREEN_OK },
  clueNum: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#bd6b29', alignItems: 'center', justifyContent: 'center' },
  clueNumT: { fontFamily: FONT, fontSize: 19, fontWeight: '900', color: '#fff' },
  clueHead: { fontFamily: FONT, fontSize: 15, fontWeight: '900', color: '#bd6b29' },
  clueBody: { fontFamily: SERIF, fontSize: 13, fontStyle: 'italic', color: '#17307a', marginTop: 1 },

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
