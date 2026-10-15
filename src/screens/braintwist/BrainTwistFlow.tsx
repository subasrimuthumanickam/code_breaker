// // // // // // // // // // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // // // // // // // // // import * as api from './api';
// // // // // // // // // // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,Hand,Drop,Claps,Brain,Icon} from './Art';

// // // // // // // // // // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge};
// // // // // // // // // // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // // // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // // // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // // // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // // // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // // // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // // // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // // // // // // // // // //     </View></View>);

// // // // // // // // // // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // // // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // // // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // // // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // // // // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:1400+Math.random()*1600}))).current;
// // // // // // // // // // // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:520,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // // // // // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:i*25+'deg'}]}}/>)}</View>}

// // // // // // // // // // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // // // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // // // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // // // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){const b=useRef(new Animated.Value(0)).current;
// // // // // // // // // // // // // // // // //   useEffect(()=>{Animated.loop(Animated.sequence([Animated.timing(b,{toValue:-10,duration:350,useNativeDriver:true}),Animated.timing(b,{toValue:0,duration:350,useNativeDriver:true})])).start()},[]);
// // // // // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // // // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // // // // // // // // // //     <Animated.View style={{position:'absolute',bottom:0,transform:[{translateY:b}]}}><Claps w={250}/></Animated.View></Paper>}

// // // // // // // // // // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // // // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // // // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // // // // // // // // // //   const bob=useRef(new Animated.Value(0)).current,t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // // // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // // // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // // // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // // // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot reach server'));
// // // // // // // // // // // // // // // // //     Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-12,duration:450,useNativeDriver:true}),Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})])).start();
// // // // // // // // // // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // // // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // // // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // // // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // // // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // // // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // // // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // // // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,el=l.items[0],fr=l.items[1],cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // // // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w;
// // // // // // // // // // // // // // // // //       if(hit&&openR.current){const r=await send({from:0,to:1});if(r?.correct){
// // // // // // // // // // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // // // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // // // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // // // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // // // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,hid);setHints(r.hints);const h=r.hint;if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // // // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // // // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // // // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // // // // // // // // // //     <View style={st.stage}>
// // // // // // // // // // // // // // // // //       {lv.items.map((it:any,i:number)=>{const A=ART[it.k],body=<A w={it.w} grey={it.grey} bloom={bloom} open={open}/>,
// // // // // // // // // // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1};
// // // // // // // // // // // // // // // // //         if(lv.type==='choice')return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // // // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // // // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // // // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // // // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // // // // // // // // // //       {hand&&lv.hand&&<Animated.View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9,transform:[{translateY:bob}]}}><Hand w={70}/></Animated.View>}
// // // // // // // // // // // // // // // // //     </View></>}
// // // // // // // // // // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // // // // // // // // // //   </Paper>}

// // // // // // // // // // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // // // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // // // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,3))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // // // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // // // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // // // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>{!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // // // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // // // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // // // // // // // // // const st=StyleSheet.create({
// // // // // // // // // // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // // // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // // // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // // // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // // // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // // // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // // // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // // // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // // // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // // // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // // // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // // // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // // // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // // // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // // // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // // // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // // // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // // // // // // // // import * as api from './api';
// // // // // // // // // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,Hand,Drop,Brain,Icon} from './Art';
// // // // // // // // // // // // // // // // import {CelebrationHands} from './CelebrationHands';

// // // // // // // // // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge};
// // // // // // // // // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // // // // // // // // //     </View></View>);

// // // // // // // // // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // // // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:1400+Math.random()*1600}))).current;
// // // // // // // // // // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:520,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // // // // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:i*25+'deg'}]}}/>)}</View>}

// // // // // // // // // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){const b=useRef(new Animated.Value(0)).current;
// // // // // // // // // // // // // // // //   useEffect(()=>{Animated.loop(Animated.sequence([Animated.timing(b,{toValue:-10,duration:350,useNativeDriver:true}),Animated.timing(b,{toValue:0,duration:350,useNativeDriver:true})])).start()},[]);
// // // // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // // // // // // // // //     <Animated.View style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center',transform:[{translateY:b}]}}>
// // // // // // // // // // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // // // // // // // // // //     </Animated.View></Paper>}

// // // // // // // // // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // // // // // // // // //   const bob=useRef(new Animated.Value(0)).current,t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot reach server'));
// // // // // // // // // // // // // // // //     Animated.loop(Animated.sequence([Animated.timing(bob,{toValue:-12,duration:450,useNativeDriver:true}),Animated.timing(bob,{toValue:0,duration:450,useNativeDriver:true})])).start();
// // // // // // // // // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,el=l.items[0],fr=l.items[1],cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w;
// // // // // // // // // // // // // // // //       if(hit&&openR.current){const r=await send({from:0,to:1});if(r?.correct){
// // // // // // // // // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,hid);setHints(r.hints);const h=r.hint;if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // // // // // // // // //     <View style={st.stage}>
// // // // // // // // // // // // // // // //       {lv.items.map((it:any,i:number)=>{const A=ART[it.k],body=<A w={it.w} grey={it.grey} bloom={bloom} open={open}/>,
// // // // // // // // // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1};
// // // // // // // // // // // // // // // //         if(lv.type==='choice')return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // // // // // // // // //       {hand&&lv.hand&&<Animated.View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9,transform:[{translateY:bob}]}}><Hand w={70}/></Animated.View>}
// // // // // // // // // // // // // // // //     </View></>}
// // // // // // // // // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // // // // // // // // //   </Paper>}

// // // // // // // // // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,3))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>{!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // // // // // // // // const st=StyleSheet.create({
// // // // // // // // // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // // // // // // // import * as api from './api';
// // // // // // // // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,Drop,Brain,Icon} from './Art';
// // // // // // // // // // // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // // // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge};
// // // // // // // // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // // // // // // // //     </View></View>);

// // // // // // // // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // // // // // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // // // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // // // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // // // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // // // // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // // // // // // // // //     </View></Paper>}

// // // // // // // // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // // // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot reach server'));
// // // // // // // // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,el=l.items[0],fr=l.items[1],cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w;
// // // // // // // // // // // // // // //       if(hit&&openR.current){const r=await send({from:0,to:1});if(r?.correct){
// // // // // // // // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,hid);setHints(r.hints);const h=r.hint;if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // // // // // // // //     <View style={st.stage}>
// // // // // // // // // // // // // // //       {lv.items.map((it:any,i:number)=>{const A=ART[it.k],body=<A w={it.w} grey={it.grey} bloom={bloom} open={open}/>,
// // // // // // // // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1};
// // // // // // // // // // // // // // //         if(lv.type==='choice')return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // // // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // // // // // // // // // //     </View></>}
// // // // // // // // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // // // // // // // //   </Paper>}

// // // // // // // // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,3))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>{!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // // // // // // // const st=StyleSheet.create({
// // // // // // // // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // // // // // // import * as api from './api';
// // // // // // // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,Drop,Brain,Icon} from './Art';
// // // // // // // // // // // // // // import {CelebrationHands,PointerHand,Confetti} from './CelebrationHands';

// // // // // // // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge};
// // // // // // // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // // // // // // //     </View></View>);

// // // // // // // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // // // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // // // // // // // //     </View></Paper>}

// // // // // // // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot reach server'));
// // // // // // // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,el=l.items[0],fr=l.items[1],cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w;
// // // // // // // // // // // // // //       if(hit&&openR.current){const r=await send({from:0,to:1});if(r?.correct){
// // // // // // // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,hid);setHints(r.hints);const h=r.hint;if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // // // // // // //     <View style={st.stage}>
// // // // // // // // // // // // // //       {lv.items.map((it:any,i:number)=>{const A=ART[it.k],body=<A w={it.w} grey={it.grey} bloom={bloom} open={open}/>,
// // // // // // // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1};
// // // // // // // // // // // // // //         if(lv.type==='choice')return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // // // // // // // // //     </View></>}
// // // // // // // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // // // // // // //   </Paper>}

// // // // // // // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,3))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>{!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // // // // // // const st=StyleSheet.create({
// // // // // // // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});

// // // // // // // // // // // // // import React, { useEffect, useRef, useState } from 'react';
// // // // // // // // // // // // // import {
// // // // // // // // // // // // //   View,
// // // // // // // // // // // // //   Text,
// // // // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // // // //   Animated,
// // // // // // // // // // // // //   PanResponder,
// // // // // // // // // // // // //   StyleSheet,
// // // // // // // // // // // // //   Dimensions,
// // // // // // // // // // // // //   Platform,
// // // // // // // // // // // // // } from 'react-native';

// // // // // // // // // // // // // import * as api from './api';

// // // // // // // // // // // // // import {
// // // // // // // // // // // // //   Lion,
// // // // // // // // // // // // //   Elephant,
// // // // // // // // // // // // //   Mouse,
// // // // // // // // // // // // //   Zebra,
// // // // // // // // // // // // //   Sloth,
// // // // // // // // // // // // //   Cloud,
// // // // // // // // // // // // //   Flower,
// // // // // // // // // // // // //   Fridge,
// // // // // // // // // // // // //   Drop,
// // // // // // // // // // // // //   Brain,
// // // // // // // // // // // // //   Icon,
// // // // // // // // // // // // // } from './Art';

// // // // // // // // // // // // // import {
// // // // // // // // // // // // //   CelebrationHands,
// // // // // // // // // // // // //   PointerHand,
// // // // // // // // // // // // //   Confetti,
// // // // // // // // // // // // // } from './CelebrationHands';

// // // // // // // // // // // // // const ART: any = {
// // // // // // // // // // // // //   lion: Lion,
// // // // // // // // // // // // //   elephant: Elephant,
// // // // // // // // // // // // //   mouse: Mouse,
// // // // // // // // // // // // //   zebra: Zebra,
// // // // // // // // // // // // //   sloth: Sloth,
// // // // // // // // // // // // //   cloud: Cloud,
// // // // // // // // // // // // //   flower: Flower,
// // // // // // // // // // // // //   fridge: Fridge,
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const EMOJI: Record<string, string> = {
// // // // // // // // // // // // //   moon: '🌙',
// // // // // // // // // // // // //   sun: '☀️',
// // // // // // // // // // // // //   pizza: '🍕',
// // // // // // // // // // // // //   racer: '🏎️',
// // // // // // // // // // // // //   cookie: '🍪',
// // // // // // // // // // // // //   cat: '🐱',
// // // // // // // // // // // // //   barrier: '🧱',
// // // // // // // // // // // // // };

// // // // // // // // // // // // // const F: any = Platform.select({
// // // // // // // // // // // // //   ios: 'Chalkboard SE',
// // // // // // // // // // // // //   android: 'sans-serif-condensed',
// // // // // // // // // // // // //   default: 'sans-serif',
// // // // // // // // // // // // // });

// // // // // // // // // // // // // const INK = '#1b1b1b';
// // // // // // // // // // // // // const GREEN = '#c5f158';
// // // // // // // // // // // // // const W = Dimensions.get('window').width;

// // // // // // // // // // // // // const Round = ({ n, onPress }: any) => (
// // // // // // // // // // // // //   <TouchableOpacity onPress={onPress} style={st.round}>
// // // // // // // // // // // // //     <Icon n={n} s={16} />
// // // // // // // // // // // // //   </TouchableOpacity>
// // // // // // // // // // // // // );

// // // // // // // // // // // // // const Paper = ({ title, hints, onHome, bottom, children }: any) => (
// // // // // // // // // // // // //   <View style={st.wood}>
// // // // // // // // // // // // //     <View style={st.pink} />

// // // // // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // // // // //       <View style={st.holes}>
// // // // // // // // // // // // //         {Array.from({ length: 12 }, (_, i) => (
// // // // // // // // // // // // //           <View key={i} style={st.hole} />
// // // // // // // // // // // // //         ))}
// // // // // // // // // // // // //       </View>

// // // // // // // // // // // // //       {Array.from({ length: 13 }, (_, i) => (
// // // // // // // // // // // // //         <View key={i} style={[st.ln, { top: 90 + i * 40 }]} />
// // // // // // // // // // // // //       ))}

// // // // // // // // // // // // //       <View style={st.head}>
// // // // // // // // // // // // //         <Round n="home" onPress={onHome} />
// // // // // // // // // // // // //         <Round n="gear" />
// // // // // // // // // // // // //         <Round n="dots" />

// // // // // // // // // // // // //         {title ? (
// // // // // // // // // // // // //           <Text style={st.title}>{title}</Text>
// // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // //           <View style={{ width: 60 }} />
// // // // // // // // // // // // //         )}

// // // // // // // // // // // // //         <View style={st.pill}>
// // // // // // // // // // // // //           <Text style={st.pn}>{hints}</Text>
// // // // // // // // // // // // //           <Icon n="bulb" s={16} />
// // // // // // // // // // // // //         </View>
// // // // // // // // // // // // //       </View>

// // // // // // // // // // // // //       <View style={st.body}>
// // // // // // // // // // // // //         {children}
// // // // // // // // // // // // //       </View>

// // // // // // // // // // // // //       {bottom}
// // // // // // // // // // // // //     </View>
// // // // // // // // // // // // //   </View>
// // // // // // // // // // // // // );

// // // // // // // // // // // // // const Bar = ({ onHint, onGift, onVideo, onSkip }: any) => (
// // // // // // // // // // // // //   <View style={st.bar}>
// // // // // // // // // // // // //     {[
// // // // // // // // // // // // //       ['search', 'x25', onHint, '#bdeaf2'],
// // // // // // // // // // // // //       ['gift', '', onGift, 'transparent'],
// // // // // // // // // // // // //       ['film', '+75', onVideo, '#d9bff7'],
// // // // // // // // // // // // //       ['play', 'x50', onSkip, '#f4a0a0'],
// // // // // // // // // // // // //     ].map(([n, c, f, bg]: any) => (
// // // // // // // // // // // // //       <TouchableOpacity
// // // // // // // // // // // // //         key={n}
// // // // // // // // // // // // //         onPress={f}
// // // // // // // // // // // // //         style={{ alignItems: 'center' }}
// // // // // // // // // // // // //       >
// // // // // // // // // // // // //         <View
// // // // // // // // // // // // //           style={{
// // // // // // // // // // // // //             flexDirection: 'row',
// // // // // // // // // // // // //             height: 20,
// // // // // // // // // // // // //             alignItems: 'center',
// // // // // // // // // // // // //           }}
// // // // // // // // // // // // //         >
// // // // // // // // // // // // //           {c ? (
// // // // // // // // // // // // //             <>
// // // // // // // // // // // // //               <Icon n="bulb" s={16} />
// // // // // // // // // // // // //               <Text style={st.cost}>{c}</Text>
// // // // // // // // // // // // //             </>
// // // // // // // // // // // // //           ) : null}
// // // // // // // // // // // // //         </View>

// // // // // // // // // // // // //         <View
// // // // // // // // // // // // //           style={[
// // // // // // // // // // // // //             st.bcircle,
// // // // // // // // // // // // //             {
// // // // // // // // // // // // //               backgroundColor: bg,
// // // // // // // // // // // // //               borderColor: n === 'gift' ? 'transparent' : INK,
// // // // // // // // // // // // //             },
// // // // // // // // // // // // //           ]}
// // // // // // // // // // // // //         >
// // // // // // // // // // // // //           <Icon n={n} s={24} />
// // // // // // // // // // // // //         </View>
// // // // // // // // // // // // //       </TouchableOpacity>
// // // // // // // // // // // // //     ))}
// // // // // // // // // // // // //   </View>
// // // // // // // // // // // // // );

// // // // // // // // // // // // // function Splash({ onDone }: any) {
// // // // // // // // // // // // //   const [p, setP] = useState(0);

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     const timer = setInterval(() => {
// // // // // // // // // // // // //       setP((x) => Math.min(100, x + 2));
// // // // // // // // // // // // //     }, 45);

// // // // // // // // // // // // //     return () => clearInterval(timer);
// // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     if (p >= 100) {
// // // // // // // // // // // // //       const timer = setTimeout(onDone, 300);
// // // // // // // // // // // // //       return () => clearTimeout(timer);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }, [p, onDone]);

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <View style={st.splash}>
// // // // // // // // // // // // //       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
// // // // // // // // // // // // //         <Brain w={210} p={p} />
// // // // // // // // // // // // //         <Text style={st.pct}>{p}%</Text>
// // // // // // // // // // // // //       </View>
// // // // // // // // // // // // //     </View>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // function Win({ n, hints, msg, hasNext, onNext, onHome }: any) {
// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <Paper
// // // // // // // // // // // // //       title={`LEVEL ${n}`}
// // // // // // // // // // // // //       hints={hints}
// // // // // // // // // // // // //       onHome={onHome}
// // // // // // // // // // // // //     >
// // // // // // // // // // // // //       <Confetti />

// // // // // // // // // // // // //       <Text style={st.msg}>
// // // // // // // // // // // // //         {msg || 'Correct answer!'}
// // // // // // // // // // // // //       </Text>

// // // // // // // // // // // // //       <TouchableOpacity style={st.next} onPress={onNext}>
// // // // // // // // // // // // //         <Text style={st.nt}>
// // // // // // // // // // // // //           {hasNext ? 'NEXT' : 'DONE'}
// // // // // // // // // // // // //         </Text>
// // // // // // // // // // // // //       </TouchableOpacity>

// // // // // // // // // // // // //       <View
// // // // // // // // // // // // //         pointerEvents="none"
// // // // // // // // // // // // //         style={{
// // // // // // // // // // // // //           position: 'absolute',
// // // // // // // // // // // // //           bottom: 0,
// // // // // // // // // // // // //           left: 0,
// // // // // // // // // // // // //           right: 0,
// // // // // // // // // // // // //           alignItems: 'center',
// // // // // // // // // // // // //         }}
// // // // // // // // // // // // //       >
// // // // // // // // // // // // //         <CelebrationHands
// // // // // // // // // // // // //           variant={hasNext ? 'clap' : 'tips'}
// // // // // // // // // // // // //           width={Math.min(W - 30, 340)}
// // // // // // // // // // // // //         />
// // // // // // // // // // // // //       </View>
// // // // // // // // // // // // //     </Paper>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // function Level({
// // // // // // // // // // // // //   n,
// // // // // // // // // // // // //   player,
// // // // // // // // // // // // //   hints,
// // // // // // // // // // // // //   setHints,
// // // // // // // // // // // // //   onWin,
// // // // // // // // // // // // //   onHome,
// // // // // // // // // // // // // }: any) {
// // // // // // // // // // // // //   const [lv, setLv] = useState<any>(null);
// // // // // // // // // // // // //   const [hid, setHid] = useState<number[]>([]);
// // // // // // // // // // // // //   const [mark, setMark] = useState<any>(null);
// // // // // // // // // // // // //   const [hand, setHand] = useState(true);
// // // // // // // // // // // // //   const [rain, setRain] = useState(false);
// // // // // // // // // // // // //   const [bloom, setBloom] = useState(false);
// // // // // // // // // // // // //   const [open, setOpen] = useState(false);
// // // // // // // // // // // // //   const [note, setNote] = useState('');
// // // // // // // // // // // // //   const [done, setDone] = useState(false);

// // // // // // // // // // // // //   const t = useRef(new Animated.Value(0)).current;
// // // // // // // // // // // // //   const pan = useRef(new Animated.ValueXY()).current;
// // // // // // // // // // // // //   const sc = useRef(new Animated.Value(1)).current;

// // // // // // // // // // // // //   const lvR = useRef<any>(null);
// // // // // // // // // // // // //   const openR = useRef(false);

// // // // // // // // // // // // //   lvR.current = lv;
// // // // // // // // // // // // //   openR.current = open;

// // // // // // // // // // // // //   const flash = (message: string) => {
// // // // // // // // // // // // //     setNote(message);
// // // // // // // // // // // // //     setTimeout(() => setNote(''), 1800);
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     let active = true;

// // // // // // // // // // // // //     api.level(n)
// // // // // // // // // // // // //       .then((data: any) => {
// // // // // // // // // // // // //         if (active) setLv(data);
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //       .catch(() => {
// // // // // // // // // // // // //         if (active) flash('Cannot reach server. Check config.ts');
// // // // // // // // // // // // //       });

// // // // // // // // // // // // //     const animation = Animated.loop(
// // // // // // // // // // // // //       Animated.timing(t, {
// // // // // // // // // // // // //         toValue: 1,
// // // // // // // // // // // // //         duration: 800,
// // // // // // // // // // // // //         useNativeDriver: true,
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //     );

// // // // // // // // // // // // //     animation.start();

// // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // //       active = false;
// // // // // // // // // // // // //       animation.stop();
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //   }, [n]);

// // // // // // // // // // // // //   const send = async (answer: any) => {
// // // // // // // // // // // // //     if (!player?.id) {
// // // // // // // // // // // // //       flash('Player not ready. Please restart the game.');
// // // // // // // // // // // // //       return null;
// // // // // // // // // // // // //     }

// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       return await api.answer(n, player.id, answer);
// // // // // // // // // // // // //     } catch {
// // // // // // // // // // // // //       flash('Network error');
// // // // // // // // // // // // //       return null;
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const finishIfCorrect = (result: any) => {
// // // // // // // // // // // // //     if (result?.correct) {
// // // // // // // // // // // // //       setDone(true);
// // // // // // // // // // // // //       setTimeout(() => onWin(result), 700);
// // // // // // // // // // // // //       return true;
// // // // // // // // // // // // //     }

// // // // // // // // // // // // //     return false;
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   // Levels 1 and 4: tap an illustrated answer.
// // // // // // // // // // // // //   const pick = async (index: number) => {
// // // // // // // // // // // // //     if (done || hid.includes(index)) return;

// // // // // // // // // // // // //     setHand(false);

// // // // // // // // // // // // //     const item = lv?.items?.[index];
// // // // // // // // // // // // //     const result = await send(index);

// // // // // // // // // // // // //     if (!result) return;

// // // // // // // // // // // // //     if (item) {
// // // // // // // // // // // // //       setMark({
// // // // // // // // // // // // //         x: item.x + item.w / 2,
// // // // // // // // // // // // //         y: item.y + item.w * 0.45,
// // // // // // // // // // // // //         ok: !!result.correct,
// // // // // // // // // // // // //       });
// // // // // // // // // // // // //     }

// // // // // // // // // // // // //     if (!finishIfCorrect(result)) {
// // // // // // // // // // // // //       setTimeout(() => setMark(null), 800);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   // Level 5: answer the pizza count, not an illustration index.
// // // // // // // // // // // // //   const answerNumber = async (value: number) => {
// // // // // // // // // // // // //     if (done) return;

// // // // // // // // // // // // //     setHand(false);

// // // // // // // // // // // // //     const result = await send(value);
// // // // // // // // // // // // //     if (result) finishIfCorrect(result);
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   // Level 2: tap the clouds to make it rain.
// // // // // // // // // // // // //   const cloud = () => {
// // // // // // // // // // // // //     if (rain || done) return;

// // // // // // // // // // // // //     setHand(false);
// // // // // // // // // // // // //     setRain(true);

// // // // // // // // // // // // //     setTimeout(() => setBloom(true), 1700);

// // // // // // // // // // // // //     setTimeout(async () => {
// // // // // // // // // // // // //       const result = await send(1);
// // // // // // // // // // // // //       if (result) finishIfCorrect(result);
// // // // // // // // // // // // //     }, 2800);
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   // Levels 3 and 7: drag an item onto its target.
// // // // // // // // // // // // //   const dragResponder = useRef(
// // // // // // // // // // // // //     PanResponder.create({
// // // // // // // // // // // // //       onStartShouldSetPanResponder: () => true,

// // // // // // // // // // // // //       onPanResponderGrant: () => {
// // // // // // // // // // // // //         setHand(false);
// // // // // // // // // // // // //       },

// // // // // // // // // // // // //       onPanResponderMove: Animated.event(
// // // // // // // // // // // // //         [null, { dx: pan.x, dy: pan.y }],
// // // // // // // // // // // // //         { useNativeDriver: false }
// // // // // // // // // // // // //       ),

// // // // // // // // // // // // //       onPanResponderRelease: async (_, gesture) => {
// // // // // // // // // // // // //         const current = lvR.current;
// // // // // // // // // // // // //         if (!current || done) return;

// // // // // // // // // // // // //         const items = current.items || [];
// // // // // // // // // // // // //         const source = items[0];

// // // // // // // // // // // // //         // Level 3: elephant -> fridge (item 1).
// // // // // // // // // // // // //         // Level 7: cookie -> cat (item 2).
// // // // // // // // // // // // //         const targetIndex = n === 7 ? 2 : 1;
// // // // // // // // // // // // //         const target = items[targetIndex];

// // // // // // // // // // // // //         if (!source || !target) {
// // // // // // // // // // // // //           Animated.spring(pan, {
// // // // // // // // // // // // //             toValue: { x: 0, y: 0 },
// // // // // // // // // // // // //             useNativeDriver: false,
// // // // // // // // // // // // //           }).start();
// // // // // // // // // // // // //           return;
// // // // // // // // // // // // //         }

// // // // // // // // // // // // //         const centerX = source.x + source.w / 2 + gesture.dx;
// // // // // // // // // // // // //         const centerY = source.y + source.w / 2 + gesture.dy;

// // // // // // // // // // // // //         const hit =
// // // // // // // // // // // // //           centerX >= target.x &&
// // // // // // // // // // // // //           centerX <= target.x + target.w &&
// // // // // // // // // // // // //           centerY >= target.y &&
// // // // // // // // // // // // //           centerY <= target.y + target.w;

// // // // // // // // // // // // //         if (hit && n === 3 && !openR.current) {
// // // // // // // // // // // // //           flash('Open the fridge first!');
// // // // // // // // // // // // //         } else if (hit) {
// // // // // // // // // // // // //           const answer = { from: 0, to: targetIndex };
// // // // // // // // // // // // //           const result = await send(answer);

// // // // // // // // // // // // //           if (result?.correct) {
// // // // // // // // // // // // //             Animated.parallel([
// // // // // // // // // // // // //               Animated.timing(sc, {
// // // // // // // // // // // // //                 toValue: 0.25,
// // // // // // // // // // // // //                 duration: 400,
// // // // // // // // // // // // //                 useNativeDriver: false,
// // // // // // // // // // // // //               }),
// // // // // // // // // // // // //               Animated.timing(pan, {
// // // // // // // // // // // // //                 toValue: {
// // // // // // // // // // // // //                   x: target.x + target.w / 3 - source.x,
// // // // // // // // // // // // //                   y: target.y + target.w / 3 - source.y,
// // // // // // // // // // // // //                 },
// // // // // // // // // // // // //                 duration: 400,
// // // // // // // // // // // // //                 useNativeDriver: false,
// // // // // // // // // // // // //               }),
// // // // // // // // // // // // //             ]).start();

// // // // // // // // // // // // //             setDone(true);
// // // // // // // // // // // // //             setTimeout(() => onWin(result), 800);
// // // // // // // // // // // // //             return;
// // // // // // // // // // // // //           }

// // // // // // // // // // // // //           if (result) flash('Try again!');
// // // // // // // // // // // // //         }

// // // // // // // // // // // // //         Animated.spring(pan, {
// // // // // // // // // // // // //           toValue: { x: 0, y: 0 },
// // // // // // // // // // // // //           useNativeDriver: false,
// // // // // // // // // // // // //         }).start();
// // // // // // // // // // // // //       },
// // // // // // // // // // // // //     })
// // // // // // // // // // // // //   ).current;

// // // // // // // // // // // // //   const hint = async () => {
// // // // // // // // // // // // //     if (!player?.id) return;

// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const result = await api.hint(n, player.id, hid);
// // // // // // // // // // // // //       setHints(result.hints);

// // // // // // // // // // // // //       const h = result.hint;

// // // // // // // // // // // // //       if (h?.remove != null) {
// // // // // // // // // // // // //         setHid((previous) => [...previous, h.remove]);
// // // // // // // // // // // // //       } else if (h?.text) {
// // // // // // // // // // // // //         flash(h.text);
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     } catch (error: any) {
// // // // // // // // // // // // //       flash(error?.status === 402 ? 'Not enough hints' : 'Network error');
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const reward = async (kind: string) => {
// // // // // // // // // // // // //     if (!player?.id) return;

// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const result = await api.reward(player.id, kind);
// // // // // // // // // // // // //       setHints(result.hints);
// // // // // // // // // // // // //     } catch {
// // // // // // // // // // // // //       flash('Could not claim reward');
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const skip = async () => {
// // // // // // // // // // // // //     if (!player?.id || done) return;

// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const result = await api.skip(n, player.id);
// // // // // // // // // // // // //       setHints(result.hints ?? Math.max(0, hints - 50));
// // // // // // // // // // // // //       setDone(true);
// // // // // // // // // // // // //       onWin(result);
// // // // // // // // // // // // //     } catch (error: any) {
// // // // // // // // // // // // //       flash(error?.status === 402 ? 'Not enough hints' : 'Network error');
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const renderItem = (item: any) => {
// // // // // // // // // // // // //     const Component = ART[item.k];

// // // // // // // // // // // // //     if (Component) {
// // // // // // // // // // // // //       return (
// // // // // // // // // // // // //         <Component
// // // // // // // // // // // // //           w={item.w}
// // // // // // // // // // // // //           grey={item.grey}
// // // // // // // // // // // // //           bloom={bloom}
// // // // // // // // // // // // //           open={open}
// // // // // // // // // // // // //         />
// // // // // // // // // // // // //       );
// // // // // // // // // // // // //     }

// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <View
// // // // // // // // // // // // //         style={[
// // // // // // // // // // // // //           st.emojiWrap,
// // // // // // // // // // // // //           { width: item.w, height: item.w },
// // // // // // // // // // // // //           item.grey && { opacity: 0.4 },
// // // // // // // // // // // // //         ]}
// // // // // // // // // // // // //       >
// // // // // // // // // // // // //         <Text style={{ fontSize: item.k === 'barrier' ? 40 : item.w * 0.65 }}>
// // // // // // // // // // // // //           {EMOJI[item.k] || '❔'}
// // // // // // // // // // // // //         </Text>
// // // // // // // // // // // // //       </View>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const numericOptions: number[] =
// // // // // // // // // // // // //     n === 5 ? [3, 4, 5, 6] :
// // // // // // // // // // // // //     n === 6 ? [1, 2, 3, 4] :
// // // // // // // // // // // // //     [];

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <Paper
// // // // // // // // // // // // //       title={`LEVEL ${n}`}
// // // // // // // // // // // // //       hints={hints}
// // // // // // // // // // // // //       onHome={onHome}
// // // // // // // // // // // // //       bottom={
// // // // // // // // // // // // //         <Bar
// // // // // // // // // // // // //           onHint={hint}
// // // // // // // // // // // // //           onGift={() => reward('gift')}
// // // // // // // // // // // // //           onVideo={() => reward('video')}
// // // // // // // // // // // // //           onSkip={skip}
// // // // // // // // // // // // //         />
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     >
// // // // // // // // // // // // //       {lv && (
// // // // // // // // // // // // //         <>
// // // // // // // // // // // // //           <Text style={st.ql}>
// // // // // // // // // // // // //             {lv.question}
// // // // // // // // // // // // //           </Text>

// // // // // // // // // // // // //           <View style={st.stage}>
// // // // // // // // // // // // //             {(lv.items || []).map((item: any, index: number) => {
// // // // // // // // // // // // //               const position: any = {
// // // // // // // // // // // // //                 position: 'absolute',
// // // // // // // // // // // // //                 left: item.x,
// // // // // // // // // // // // //                 top: item.y,
// // // // // // // // // // // // //                 opacity: hid.includes(index) ? 0.2 : 1,
// // // // // // // // // // // // //               };

// // // // // // // // // // // // //               if (lv.type === 'choice') {
// // // // // // // // // // // // //                 // Levels 5 and 6 use number buttons below the puzzle.
// // // // // // // // // // // // //                 if (n === 5 || n === 6) {
// // // // // // // // // // // // //                   return (
// // // // // // // // // // // // //                     <View
// // // // // // // // // // // // //                       key={index}
// // // // // // // // // // // // //                       pointerEvents="none"
// // // // // // // // // // // // //                       style={position}
// // // // // // // // // // // // //                     >
// // // // // // // // // // // // //                       {renderItem(item)}
// // // // // // // // // // // // //                     </View>
// // // // // // // // // // // // //                   );
// // // // // // // // // // // // //                 }

// // // // // // // // // // // // //                 return (
// // // // // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // // // // //                     key={index}
// // // // // // // // // // // // //                     style={position}
// // // // // // // // // // // // //                     disabled={hid.includes(index) || done}
// // // // // // // // // // // // //                     onPress={() => pick(index)}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     {renderItem(item)}
// // // // // // // // // // // // //                   </TouchableOpacity>
// // // // // // // // // // // // //                 );
// // // // // // // // // // // // //               }

// // // // // // // // // // // // //               if (lv.type === 'taps' && item.k === 'cloud') {
// // // // // // // // // // // // //                 return (
// // // // // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // // // // //                     key={index}
// // // // // // // // // // // // //                     style={position}
// // // // // // // // // // // // //                     onPress={cloud}
// // // // // // // // // // // // //                     disabled={done}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     {renderItem(item)}
// // // // // // // // // // // // //                   </TouchableOpacity>
// // // // // // // // // // // // //                 );
// // // // // // // // // // // // //               }

// // // // // // // // // // // // //               if (lv.type === 'drag' && index === 0) {
// // // // // // // // // // // // //                 return (
// // // // // // // // // // // // //                   <Animated.View
// // // // // // // // // // // // //                     key={index}
// // // // // // // // // // // // //                     {...dragResponder.panHandlers}
// // // // // // // // // // // // //                     style={[
// // // // // // // // // // // // //                       position,
// // // // // // // // // // // // //                       {
// // // // // // // // // // // // //                         zIndex: 5,
// // // // // // // // // // // // //                         transform: [
// // // // // // // // // // // // //                           ...pan.getTranslateTransform(),
// // // // // // // // // // // // //                           { scale: sc },
// // // // // // // // // // // // //                         ],
// // // // // // // // // // // // //                       },
// // // // // // // // // // // // //                     ]}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     {renderItem(item)}
// // // // // // // // // // // // //                   </Animated.View>
// // // // // // // // // // // // //                 );
// // // // // // // // // // // // //               }

// // // // // // // // // // // // //               if (lv.type === 'drag' && item.k === 'fridge') {
// // // // // // // // // // // // //                 return (
// // // // // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // // // // //                     key={index}
// // // // // // // // // // // // //                     style={position}
// // // // // // // // // // // // //                     onPress={() => {
// // // // // // // // // // // // //                       setOpen(true);
// // // // // // // // // // // // //                       setHand(false);
// // // // // // // // // // // // //                     }}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     {renderItem(item)}
// // // // // // // // // // // // //                   </TouchableOpacity>
// // // // // // // // // // // // //                 );
// // // // // // // // // // // // //               }

// // // // // // // // // // // // //               return (
// // // // // // // // // // // // //                 <View
// // // // // // // // // // // // //                   key={index}
// // // // // // // // // // // // //                   style={position}
// // // // // // // // // // // // //                   pointerEvents="none"
// // // // // // // // // // // // //                 >
// // // // // // // // // // // // //                   {renderItem(item)}
// // // // // // // // // // // // //                 </View>
// // // // // // // // // // // // //               );
// // // // // // // // // // // // //             })}

// // // // // // // // // // // // //             {rain &&
// // // // // // // // // // // // //               [0, 1, 2, 3, 4, 5, 6].map((k) => (
// // // // // // // // // // // // //                 <Animated.View
// // // // // // // // // // // // //                   key={k}
// // // // // // // // // // // // //                   pointerEvents="none"
// // // // // // // // // // // // //                   style={{
// // // // // // // // // // // // //                     position: 'absolute',
// // // // // // // // // // // // //                     left: 70 + k * 28,
// // // // // // // // // // // // //                     top: 80,
// // // // // // // // // // // // //                     opacity: t.interpolate({
// // // // // // // // // // // // //                       inputRange: [0, 0.85, 1],
// // // // // // // // // // // // //                       outputRange: [1, 1, 0],
// // // // // // // // // // // // //                     }),
// // // // // // // // // // // // //                     transform: [
// // // // // // // // // // // // //                       {
// // // // // // // // // // // // //                         translateY: t.interpolate({
// // // // // // // // // // // // //                           inputRange: [0, 1],
// // // // // // // // // // // // //                           outputRange: [(k % 3) * 12, 90],
// // // // // // // // // // // // //                         }),
// // // // // // // // // // // // //                       },
// // // // // // // // // // // // //                     ],
// // // // // // // // // // // // //                   }}
// // // // // // // // // // // // //                 >
// // // // // // // // // // // // //                   <Drop />
// // // // // // // // // // // // //                 </Animated.View>
// // // // // // // // // // // // //               ))}

// // // // // // // // // // // // //             {mark && (
// // // // // // // // // // // // //               <View
// // // // // // // // // // // // //                 pointerEvents="none"
// // // // // // // // // // // // //                 style={{
// // // // // // // // // // // // //                   position: 'absolute',
// // // // // // // // // // // // //                   left: mark.x - 24,
// // // // // // // // // // // // //                   top: mark.y - 24,
// // // // // // // // // // // // //                 }}
// // // // // // // // // // // // //               >
// // // // // // // // // // // // //                 <Icon
// // // // // // // // // // // // //                   n={mark.ok ? 'check' : 'cross'}
// // // // // // // // // // // // //                   s={48}
// // // // // // // // // // // // //                 />
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //             )}

// // // // // // // // // // // // //             {hand && lv.hand && (
// // // // // // // // // // // // //               <View
// // // // // // // // // // // // //                 pointerEvents="none"
// // // // // // // // // // // // //                 style={{
// // // // // // // // // // // // //                   position: 'absolute',
// // // // // // // // // // // // //                   left: lv.hand.x,
// // // // // // // // // // // // //                   top: lv.hand.y,
// // // // // // // // // // // // //                   zIndex: 9,
// // // // // // // // // // // // //                 }}
// // // // // // // // // // // // //               >
// // // // // // // // // // // // //                 <PointerHand w={70} />
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //             )}
// // // // // // // // // // // // //           </View>

// // // // // // // // // // // // //           {(n === 5 || n === 6) && (
// // // // // // // // // // // // //             <View style={st.options}>
// // // // // // // // // // // // //               {numericOptions.map((value) => (
// // // // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // // // //                   key={value}
// // // // // // // // // // // // //                   style={st.option}
// // // // // // // // // // // // //                   onPress={() => answerNumber(value)}
// // // // // // // // // // // // //                   disabled={done}
// // // // // // // // // // // // //                 >
// // // // // // // // // // // // //                   <Text style={st.optionText}>{value}</Text>
// // // // // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // // // // //               ))}
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //           )}
// // // // // // // // // // // // //         </>
// // // // // // // // // // // // //       )}

// // // // // // // // // // // // //       {!!note && (
// // // // // // // // // // // // //         <Text style={st.note}>
// // // // // // // // // // // // //           {note}
// // // // // // // // // // // // //         </Text>
// // // // // // // // // // // // //       )}
// // // // // // // // // // // // //     </Paper>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // export default function BrainTwistFlow({ onExit }: any) {
// // // // // // // // // // // // //   const [scr, setScr] = useState('splash');
// // // // // // // // // // // // //   const [player, setPlayer] = useState<any>(null);
// // // // // // // // // // // // //   const [win, setWin] = useState<any>(null);
// // // // // // // // // // // // //   const [n, setN] = useState(1);
// // // // // // // // // // // // //   const [hints, setHints] = useState(50);
// // // // // // // // // // // // //   const [err, setErr] = useState('');

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     let active = true;

// // // // // // // // // // // // //     api.guest()
// // // // // // // // // // // // //       .then((p: any) => {
// // // // // // // // // // // // //         if (!active) return;

// // // // // // // // // // // // //         setPlayer(p);
// // // // // // // // // // // // //         setHints(p.hints);

// // // // // // // // // // // // //         // Support levels 1 through 7.
// // // // // // // // // // // // //         const current = Number(p.currentLevel) || 1;
// // // // // // // // // // // // //         setN(Math.max(1, Math.min(current, 7)));
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //       .catch(() => {
// // // // // // // // // // // // //         if (active) {
// // // // // // // // // // // // //           setErr('Cannot reach server. Check config.ts');
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //       });

// // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // //       active = false;
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // //   if (scr === 'splash') {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <Splash onDone={() => setScr('ready')} />
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   if (scr === 'ready') {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <Paper hints={hints} onHome={onExit}>
// // // // // // // // // // // // //         <Text style={st.q}>
// // // // // // // // // // // // //           {'ARE YOU READY TO TEST\nYOUR BRAIN?'}
// // // // // // // // // // // // //         </Text>

// // // // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // // // //           style={st.ready}
// // // // // // // // // // // // //           onPress={() => {
// // // // // // // // // // // // //             if (player) setScr('level');
// // // // // // // // // // // // //           }}
// // // // // // // // // // // // //         >
// // // // // // // // // // // // //           <Text style={st.rt}>READY</Text>
// // // // // // // // // // // // //         </TouchableOpacity>

// // // // // // // // // // // // //         {!!err && (
// // // // // // // // // // // // //           <Text style={st.err}>{err}</Text>
// // // // // // // // // // // // //         )}
// // // // // // // // // // // // //       </Paper>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   if (win) {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <Win
// // // // // // // // // // // // //         n={n}
// // // // // // // // // // // // //         hints={hints}
// // // // // // // // // // // // //         msg={win.message || win.msg}
// // // // // // // // // // // // //         hasNext={!!win.next}
// // // // // // // // // // // // //         onHome={onExit}
// // // // // // // // // // // // //         onNext={() => {
// // // // // // // // // // // // //           if (win.next) {
// // // // // // // // // // // // //             setN(Math.min(Number(win.next), 7));
// // // // // // // // // // // // //             setWin(null);
// // // // // // // // // // // // //           } else {
// // // // // // // // // // // // //             onExit();
// // // // // // // // // // // // //           }
// // // // // // // // // // // // //         }}
// // // // // // // // // // // // //       />
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <Level
// // // // // // // // // // // // //       key={n}
// // // // // // // // // // // // //       n={n}
// // // // // // // // // // // // //       player={player}
// // // // // // // // // // // // //       hints={hints}
// // // // // // // // // // // // //       setHints={setHints}
// // // // // // // // // // // // //       onWin={setWin}
// // // // // // // // // // // // //       onHome={onExit}
// // // // // // // // // // // // //     />
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // const st = StyleSheet.create({
// // // // // // // // // // // // //   wood: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     backgroundColor: '#e8c9a0',
// // // // // // // // // // // // //     padding: 10,
// // // // // // // // // // // // //     paddingTop: 34,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   pink: {
// // // // // // // // // // // // //     position: 'absolute',
// // // // // // // // // // // // //     left: 0,
// // // // // // // // // // // // //     top: 0,
// // // // // // // // // // // // //     bottom: 0,
// // // // // // // // // // // // //     width: 8,
// // // // // // // // // // // // //     backgroundColor: '#f08a8a',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   paper: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     backgroundColor: '#fffdf8',
// // // // // // // // // // // // //     borderRadius: 6,
// // // // // // // // // // // // //     overflow: 'hidden',
// // // // // // // // // // // // //     elevation: 5,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   holes: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     justifyContent: 'space-around',
// // // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   hole: {
// // // // // // // // // // // // //     width: 16,
// // // // // // // // // // // // //     height: 22,
// // // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // // //     backgroundColor: '#e8c9a0',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   ln: {
// // // // // // // // // // // // //     position: 'absolute',
// // // // // // // // // // // // //     left: 0,
// // // // // // // // // // // // //     right: 0,
// // // // // // // // // // // // //     height: 2,
// // // // // // // // // // // // //     backgroundColor: '#e3f0ee',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   head: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     gap: 5,
// // // // // // // // // // // // //     marginTop: 6,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   round: {
// // // // // // // // // // // // //     width: 30,
// // // // // // // // // // // // //     height: 30,
// // // // // // // // // // // // //     borderRadius: 15,
// // // // // // // // // // // // //     backgroundColor: '#ffe27a',
// // // // // // // // // // // // //     borderWidth: 2,
// // // // // // // // // // // // //     borderColor: INK,
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   title: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 20,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //     marginHorizontal: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   pill: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     borderWidth: 2,
// // // // // // // // // // // // //     borderColor: INK,
// // // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // // //     paddingHorizontal: 8,
// // // // // // // // // // // // //     backgroundColor: '#fff',
// // // // // // // // // // // // //     height: 26,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   pn: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     marginRight: 3,
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   body: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     padding: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   q: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 28,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     textAlign: 'center',
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //     marginBottom: 22,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   ready: {
// // // // // // // // // // // // //     backgroundColor: GREEN,
// // // // // // // // // // // // //     borderWidth: 3,
// // // // // // // // // // // // //     borderColor: INK,
// // // // // // // // // // // // //     borderRadius: 28,
// // // // // // // // // // // // //     paddingHorizontal: 52,
// // // // // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   rt: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 32,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   err: {
// // // // // // // // // // // // //     color: '#c0392b',
// // // // // // // // // // // // //     marginTop: 14,
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   ql: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 17,
// // // // // // // // // // // // //     color: '#444',
// // // // // // // // // // // // //     textAlign: 'center',
// // // // // // // // // // // // //     position: 'absolute',
// // // // // // // // // // // // //     top: 6,
// // // // // // // // // // // // //     paddingHorizontal: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   stage: {
// // // // // // // // // // // // //     width: 320,
// // // // // // // // // // // // //     height: 300,
// // // // // // // // // // // // //     marginTop: 20,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   emojiWrap: {
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   options: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     gap: 12,
// // // // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // // // //     marginBottom: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   option: {
// // // // // // // // // // // // //     minWidth: 48,
// // // // // // // // // // // // //     height: 48,
// // // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // // //     backgroundColor: GREEN,
// // // // // // // // // // // // //     borderWidth: 2,
// // // // // // // // // // // // //     borderColor: INK,
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   optionText: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 22,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   note: {
// // // // // // // // // // // // //     position: 'absolute',
// // // // // // // // // // // // //     bottom: 6,
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 17,
// // // // // // // // // // // // //     color: '#c0392b',
// // // // // // // // // // // // //     textAlign: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   bar: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     gap: 22,
// // // // // // // // // // // // //     paddingBottom: 12,
// // // // // // // // // // // // //     paddingTop: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   bcircle: {
// // // // // // // // // // // // //     width: 50,
// // // // // // // // // // // // //     height: 50,
// // // // // // // // // // // // //     borderRadius: 25,
// // // // // // // // // // // // //     borderWidth: 2.5,
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   cost: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     fontSize: 15,
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //     marginLeft: 2,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   msg: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 24,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     textTransform: 'uppercase',
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //     marginBottom: 34,
// // // // // // // // // // // // //     textAlign: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   next: {
// // // // // // // // // // // // //     backgroundColor: GREEN,
// // // // // // // // // // // // //     borderWidth: 3,
// // // // // // // // // // // // //     borderColor: INK,
// // // // // // // // // // // // //     borderRadius: 26,
// // // // // // // // // // // // //     paddingHorizontal: 46,
// // // // // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   nt: {
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 30,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     color: INK,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   splash: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     backgroundColor: '#fff',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   pct: {
// // // // // // // // // // // // //     position: 'absolute',
// // // // // // // // // // // // //     fontFamily: F,
// // // // // // // // // // // // //     fontSize: 34,
// // // // // // // // // // // // //     fontWeight: 'bold',
// // // // // // // // // // // // //     color: '#d11',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // // });
// // // // // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // // // // import * as api from './api';
// // // // // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // // // // // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat};
// // // // // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // // // // true  = every level can be opened from the READY screen (good for testing)
// // // // // // // // // // // // // false = only levels the player already reached
// // // // // // // // // // // // const UNLOCK_ALL=true;

// // // // // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // // // // //     </View></View>);

// // // // // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // // // // // //     </View></Paper>}

// // // // // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),
// // // // // // // // // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // // // // //   // choice level: tap an item (answer = item index)
// // // // // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // // // // //   // choice level with number options (answer = the number)
// // // // // // // // // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // // // // // // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // // // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // // // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to],cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // // // // // // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // // // // // // // // //         setOpen(true);
// // // // // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // // // // // // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // // // // //     <View style={st.stage}>
// // // // // // // // // // // //       {lv.items.map((it:any,i:number)=>{const A=ART[it.k];if(!A)return null;
// // // // // // // // // // // //         const body=<A w={it.w} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1};
// // // // // // // // // // // //         if(lv.type==='choice'&&!lv.options)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // // // // // // //     </View>
// // // // // // // // // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // // // // // // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // // // // // // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // // // // // // // // //     </>}
// // // // // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // // // // //   </Paper>}

// // // // // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||7))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>
// // // // // // // // // // // //     {player&&<><Text style={st.pl}>OR PICK A LEVEL</Text>
// // // // // // // // // // // //     <View style={st.picker}>{Array.from({length:player.total||7},(_,i)=>i+1).map(k=>{const ok=UNLOCK_ALL||k<=player.currentLevel;
// // // // // // // // // // // //       return <TouchableOpacity key={k} disabled={!ok} onPress={()=>{setN(k);setWin(null);setScr('level')}} style={[st.pk,{opacity:ok?1:0.3}]}><Text style={st.pkt}>{k}</Text></TouchableOpacity>})}</View></>}
// // // // // // // // // // // //     {!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // // // // const st=StyleSheet.create({
// // // // // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // // // // //   pl:{fontFamily:F,fontSize:13,color:'#777',marginTop:26,letterSpacing:1},
// // // // // // // // // // // //   picker:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10,marginTop:10,maxWidth:300},
// // // // // // // // // // // //   pk:{width:42,height:42,borderRadius:21,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},pkt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // // // // // // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // // // import * as api from './api';
// // // // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // // // // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat};
// // // // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // // // true  = every level can be opened from the READY screen (good for testing)
// // // // // // // // // // // // false = only levels the player already reached
// // // // // // // // // // // const UNLOCK_ALL=true;

// // // // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // // // //     </View></View>);

// // // // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // // // // //     </View></Paper>}

// // // // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),
// // // // // // // // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // // // //   // choice level: tap an item (answer = item index)
// // // // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // // // //   // choice level with number options (answer = the number)
// // // // // // // // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // // // // // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to],cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // // // // // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // // // // // // // //         setOpen(true);
// // // // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // // // // // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // // // //     <View style={st.stage}>
// // // // // // // // // // //       {lv.items.map((it:any,i:number)=>{const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // // // // // // // // //         const body=<A w={it.w} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1};
// // // // // // // // // // //         if(lv.type==='choice'&&!lv.options)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // // // // // //     </View>
// // // // // // // // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // // // // // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // // // // // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // // // // // // // //     </>}
// // // // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // // // //   </Paper>}

// // // // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||7))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>
// // // // // // // // // // //     {player&&<><Text style={st.pl}>OR PICK A LEVEL</Text>
// // // // // // // // // // //     <View style={st.picker}>{Array.from({length:player.total||7},(_,i)=>i+1).map(k=>{const ok=UNLOCK_ALL||k<=player.currentLevel;
// // // // // // // // // // //       return <TouchableOpacity key={k} disabled={!ok} onPress={()=>{setN(k);setWin(null);setScr('level')}} style={[st.pk,{opacity:ok?1:0.3}]}><Text style={st.pkt}>{k}</Text></TouchableOpacity>})}</View></>}
// // // // // // // // // // //     {!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // // // const st=StyleSheet.create({
// // // // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // // // //   pl:{fontFamily:F,fontSize:13,color:'#777',marginTop:26,letterSpacing:1},
// // // // // // // // // // //   picker:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10,marginTop:10,maxWidth:300},
// // // // // // // // // // //   pk:{width:42,height:42,borderRadius:21,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},pkt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // // // // // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // // import * as api from './api';
// // // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // // // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat};
// // // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // // true  = every level can be opened from the READY screen (good for testing)
// // // // // // // // // // // false = only levels the player already reached
// // // // // // // // // // const UNLOCK_ALL=true;

// // // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // // //     <View style={st.paper}>
// // // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // // //     </View></View>);

// // // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // // // //     </View></Paper>}

// // // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // // // // // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // // //   // choice level: tap an item (answer = item index)
// // // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // // //   // choice level with number options (answer = the number)
// // // // // // // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // // // // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // // // // // // //   // levels with a counter (- / +) or a keypad: send the typed number
// // // // // // // // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // // // // // // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // // // // // // // // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to],cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // // // // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // // // // // // //         setOpen(true);
// // // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // // // // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // // //     <View style={[st.stage,lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // // // // // // // //       {lv.items.map((it:any,i:number)=>{const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // // // // // // // //         const body=<A w={it.w} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // // // // // // // //         if(lv.type==='choice'&&!lv.options)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // // // // //     </View>
// // // // // // // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // // // // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // // // // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // // // // // // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // // // // // // // // //       <View style={st.crow}>
// // // // // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // // // // // // // // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // // // // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // // // // // // // // //       </View>
// // // // // // // // // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // // // // // // // // //     </View>}
// // // // // // // // // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // // // // // // // // //       <View style={st.krow}>
// // // // // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // // // // // // // // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // // // // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // // // // // // // // //       </View>
// // // // // // // // // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // // // // // // // // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // // // // // // // // //     </View>}
// // // // // // // // // //     </>}
// // // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // // //   </Paper>}

// // // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||7))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>
// // // // // // // // // //     {player&&<><Text style={st.pl}>OR PICK A LEVEL</Text>
// // // // // // // // // //     <View style={st.picker}>{Array.from({length:player.total||7},(_,i)=>i+1).map(k=>{const ok=UNLOCK_ALL||k<=player.currentLevel;
// // // // // // // // // //       return <TouchableOpacity key={k} disabled={!ok} onPress={()=>{setN(k);setWin(null);setScr('level')}} style={[st.pk,{opacity:ok?1:0.3}]}><Text style={st.pkt}>{k}</Text></TouchableOpacity>})}</View></>}
// // // // // // // // // //     {!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // // const st=StyleSheet.create({
// // // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // // //   pl:{fontFamily:F,fontSize:13,color:'#777',marginTop:26,letterSpacing:1},
// // // // // // // // // //   picker:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10,marginTop:10,maxWidth:300},
// // // // // // // // // //   pk:{width:42,height:42,borderRadius:21,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},pkt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // // // // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // // // // // // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // // // // // // // // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // // // // // // // // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // // // // // // // // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // // // // // // // // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // // import * as api from './api';
// // // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat};
// // // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // // true  = every level can be opened from the READY screen (good for testing)
// // // // // // // // // // false = only levels the player already reached
// // // // // // // // // const UNLOCK_ALL=true;

// // // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // // //     <View style={st.paper}>
// // // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // // //     </View></View>);

// // // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // // //     </View></Paper>}

// // // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // // // // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // // //   // choice level: tap an item (answer = item index)
// // // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // // //   // choice level with number options (answer = the number)
// // // // // // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // // // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // // // // // //   // levels with a counter (- / +) or a keypad: send the typed number
// // // // // // // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // // // // // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // // // // // // // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // // // // // // //   // old tap-the-cloud level (kept so old data still works)
// // // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // // // // // // //   // mode 'away': item 0 only has to be dragged away (cloud off the sun -> flower blooms)
// // // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // // // // // // // //       if(l.mode==='away'){
// // // // // // // // //         if(Math.hypot(g.dx,g.dy)>80){
// // // // // // // // //           const r=await send({from:0,to});
// // // // // // // // //           if(r?.correct){setBloom(true);setDone(true);setTimeout(()=>onWin(r),2200);return}
// // // // // // // // //         }
// // // // // // // // //         Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // // // // // // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // // // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // // // // // //         setOpen(true);
// // // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // // // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // // //     <View style={[st.stage,lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // // // // // // //       {(lv.items||[]).map((it:any,i:number)=>{const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // // // // // // //         const body=<A w={it.w} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // // // // // // //         // tap-an-item levels only (NOT the counter / keypad levels)
// // // // // // // // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // // //         if(lv.type==='drag'&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // // // //     </View>
// // // // // // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // // // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // // // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // // // // // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // // // // // // // //       <View style={st.crow}>
// // // // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // // // // // // // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // // // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // // // // // // // //       </View>
// // // // // // // // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // // // // // // // //     </View>}
// // // // // // // // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // // // // // // // //       <View style={st.krow}>
// // // // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // // // // // // // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // // // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // // // // // // // //       </View>
// // // // // // // // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // // // // // // // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // // // // // // // //     </View>}
// // // // // // // // //     </>}
// // // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // // //   </Paper>}

// // // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||7))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>
// // // // // // // // //     {player&&<><Text style={st.pl}>OR PICK A LEVEL</Text>
// // // // // // // // //     <View style={st.picker}>{Array.from({length:player.total||7},(_,i)=>i+1).map(k=>{const ok=UNLOCK_ALL||k<=player.currentLevel;
// // // // // // // // //       return <TouchableOpacity key={k} disabled={!ok} onPress={()=>{setN(k);setWin(null);setScr('level')}} style={[st.pk,{opacity:ok?1:0.3}]}><Text style={st.pkt}>{k}</Text></TouchableOpacity>})}</View></>}
// // // // // // // // //     {!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // // const st=StyleSheet.create({
// // // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // // //   pl:{fontFamily:F,fontSize:13,color:'#777',marginTop:26,letterSpacing:1},
// // // // // // // // //   picker:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10,marginTop:10,maxWidth:300},
// // // // // // // // //   pk:{width:42,height:42,borderRadius:21,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},pkt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // // // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // // // // // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // // // // // // // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // // // // // // // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // // // // // // // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // // // // // // // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // // import * as api from './api';
// // // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Wire,Cat,Drop,Brain,Icon} from './Art';
// // // // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,wire:Wire,cat:Cat};
// // // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // // true  = every level can be opened from the READY screen (good for testing)
// // // // // // // // // false = only levels the player already reached
// // // // // // // // const UNLOCK_ALL=true;

// // // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // // // //     <View style={st.paper}>
// // // // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // // //     </View></View>);

// // // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // // //     </View></Paper>}

// // // // // // // // // one independently draggable item (each cloud in level 2, each cookie in level 7)
// // // // // // // // // onDrop returns true  -> item stays where it was dropped (locked)
// // // // // // // // // onDrop returns false -> item springs back to its start position
// // // // // // // // function Draggable({style,onStart,onDrop,children}:any){
// // // // // // // //   const pan=useRef(new Animated.ValueXY()).current,locked=useRef(false);
// // // // // // // //   const cb=useRef({onStart,onDrop});cb.current={onStart,onDrop};
// // // // // // // //   const pr=useRef(PanResponder.create({
// // // // // // // //     onStartShouldSetPanResponder:()=>!locked.current,
// // // // // // // //     onPanResponderGrant:()=>cb.current.onStart?.(),
// // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // //     onPanResponderRelease:async(_,g)=>{
// // // // // // // //       const keep=await cb.current.onDrop(g,pan);
// // // // // // // //       if(keep)locked.current=true;
// // // // // // // //       else Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start();
// // // // // // // //     }})).current;
// // // // // // // //   return <Animated.View {...pr.panHandlers} style={[style,{zIndex:5,transform:pan.getTranslateTransform()}]}>{children}</Animated.View>}

// // // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // // // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // // //   const[gone,setGone]=useState<number[]>([]);
// // // // // // // //   const clr=useRef<number[]>([]),fed=useRef<number[]>([]);
// // // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // // //   // choice level: tap an item (answer = item index)
// // // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // // //   // choice level with number options (answer = the number)
// // // // // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // // // // //   // levels with a counter (- / +) or a keypad: send the typed number
// // // // // // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // // // // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // // // // // // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // // // // // //   // old tap-the-cloud level (kept so old data still works)
// // // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};

// // // // // // // //   // single drag level (level 3, elephant -> fridge): item 0 is dragged onto item lv.target
// // // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // // // // // // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // // // // //         setOpen(true);
// // // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // // //   // multi-drag levels (level 2 clouds, level 7 cookies)
// // // // // // // //   const drop=async(i:number,g:any,p:any)=>{
// // // // // // // //     const l=lvR.current,it=l.items[i];
// // // // // // // //     if(l.mode==='uncover'){
// // // // // // // //       if(Math.hypot(g.dx,g.dy)<80)return false;
// // // // // // // //       if(!clr.current.includes(i))clr.current=[...clr.current,i];
// // // // // // // //       if(l.drag.every((d:number)=>clr.current.includes(d))){
// // // // // // // //         const r=await send({cleared:clr.current});
// // // // // // // //         if(r?.correct){setBloom(true);setDone(true);setTimeout(()=>onWin(r),2200)}}
// // // // // // // //       return true}
// // // // // // // //     if(l.mode==='feed'){
// // // // // // // //       const fr=l.items[l.target],cx=it.x+it.w/2+g.dx,cy=it.y+it.w/2+g.dy,pad=20;
// // // // // // // //       if(!(cx>fr.x-pad&&cx<fr.x+fr.w+pad&&cy>fr.y-pad&&cy<fr.y+fr.w+pad))return false;
// // // // // // // //       setOpen(true);
// // // // // // // //       Animated.timing(p,{toValue:{x:fr.x+fr.w/2-(it.x+it.w/2),y:fr.y+fr.w*0.45-(it.y+it.w/2)},duration:250,useNativeDriver:false}).start(()=>setGone(x=>[...x,i]));
// // // // // // // //       if(!fed.current.includes(i))fed.current=[...fed.current,i];
// // // // // // // //       if(l.drag.every((d:number)=>fed.current.includes(d))){
// // // // // // // //         const r=await send({fed:fed.current});
// // // // // // // //         if(r?.correct){setDone(true);setTimeout(()=>onWin(r),900)}}
// // // // // // // //       return true}
// // // // // // // //     return false};

// // // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // // //     <View style={[st.stage,lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // // // // // //       {(lv.items||[]).map((it:any,i:number)=>{const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // // // // // //         const body=<A w={it.w} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // // // // // //         // tap-an-item levels only (NOT the counter / keypad levels)
// // // // // // // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // // //         // multi-drag items (many clouds / both cookies), each one moves on its own
// // // // // // // //         if(lv.type==='drag'&&lv.drag?.includes(i)){
// // // // // // // //           if(gone.includes(i))return null;
// // // // // // // //           return <Draggable key={i} style={pos} onStart={()=>setHand(false)} onDrop={(g:any,p:any)=>drop(i,g,p)}>{body}</Draggable>}
// // // // // // // //         // single drag item (level 3)
// // // // // // // //         if(lv.type==='drag'&&!lv.drag&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // // //     </View>
// // // // // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // // // // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // // // // // // //       <View style={st.crow}>
// // // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // // // // // // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // // // // // // //     </View>}
// // // // // // // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // // // // // // //       <View style={st.krow}>
// // // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // // // // // // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // // // // // // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // // // // // // //     </View>}
// // // // // // // //     </>}
// // // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // // //   </Paper>}

// // // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||7))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>
// // // // // // // //     {player&&<><Text style={st.pl}>OR PICK A LEVEL</Text>
// // // // // // // //     <View style={st.picker}>{Array.from({length:player.total||7},(_,i)=>i+1).map(k=>{const ok=UNLOCK_ALL||k<=player.currentLevel;
// // // // // // // //       return <TouchableOpacity key={k} disabled={!ok} onPress={()=>{setN(k);setWin(null);setScr('level')}} style={[st.pk,{opacity:ok?1:0.3}]}><Text style={st.pkt}>{k}</Text></TouchableOpacity>})}</View></>}
// // // // // // // //     {!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // // const st=StyleSheet.create({
// // // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // // //   pl:{fontFamily:F,fontSize:13,color:'#777',marginTop:26,letterSpacing:1},
// // // // // // // //   picker:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10,marginTop:10,maxWidth:300},
// // // // // // // //   pk:{width:42,height:42,borderRadius:21,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},pkt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // // // // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // // // // // // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // // // // // // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // // // // // // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // // // // // // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // // // // // // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // // import * as api from './api';
// // // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // // // // import Svg,{Rect,Path} from 'react-native-svg';
// // // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // // // whiteboard level art: number text, duster, chalk piece
// // // // // // // const Num=({w,t}:any)=><Text style={{fontSize:w,lineHeight:w*1.1,fontWeight:'900',color:'#1b1b1b'}}>{t}</Text>;
// // // // // // // const Duster=({w}:any)=><Svg width={w} height={w*0.55} viewBox="0 0 100 55"><Rect x="4" y="4" width="92" height="22" rx="5" fill="#c58b4a" stroke="#2b2b2b" strokeWidth="2"/><Rect x="4" y="26" width="92" height="24" rx="4" fill="#4b5563" stroke="#2b2b2b" strokeWidth="2"/><Path d="M12 33 H88 M12 40 H88" stroke="#6b7482" strokeWidth="2"/></Svg>;
// // // // // // // const Chalk=({w}:any)=><Svg width={w} height={w*0.22} viewBox="0 0 100 22"><Rect x="3" y="4" width="94" height="14" rx="5" fill="#f4f4f0" stroke="#2b2b2b" strokeWidth="2"/><Path d="M10 8 H60" stroke="#d6d6cf" strokeWidth="2" strokeLinecap="round"/></Svg>;
// // // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};
// // // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width;

// // // // // // // // true  = every level can be opened from the READY screen (good for testing)
// // // // // // // // false = only levels the player already reached
// // // // // // // const UNLOCK_ALL=true;

// // // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // // const Paper=({title,hints,onHome,bottom,children,board}:any)=>(
// // // // // // //   <View style={[st.wood,board&&st.bwood]}>{!board&&<View style={st.pink}/>}
// // // // // // //     <View style={[st.paper,board&&st.bpaper]}>
// // // // // // //       {!board&&<View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>}
// // // // // // //       {!board&&Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // // //     </View></View>);

// // // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // // //     </View></Paper>}

// // // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // // //   // choice level: tap an item (answer = item index)
// // // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // // //   // choice level with number options (answer = the number)
// // // // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // // // //   // levels with a counter (- / +) or a keypad: send the typed number
// // // // // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // // // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // // // // // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // // // // //   // old tap-the-cloud level (kept so old data still works)
// // // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // // // // //   // multi-drag levels: every item with drag:true is dragged on its own
// // // // // // //   //  mode 'away' -> each one must be dragged away (clouds off the sun -> flower blooms)
// // // // // // //   //  mode 'feed' -> each one must be dropped on item lv.target (both cookies to the cat)
// // // // // // //   const[merged,setMerged]=useState<any>(null);
// // // // // // //   const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
// // // // // // //   const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
// // // // // // //     onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
// // // // // // //     onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
// // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
// // // // // // //       if(l.mode==='combine'){
// // // // // // //         const cx=el.x+el.w*0.3+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // //         const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&cx>o.x-20&&cx<o.x+o.w*0.6+20&&cy>o.y-10&&cy<o.y+o.w*1.1+10);
// // // // // // //         if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // // // // //         const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
// // // // // // //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w*0.3-70,y:(A.y+B.y)/2-5});setDone(true);setTimeout(()=>onWin(r),1500)}
// // // // // // //         else{flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// // // // // // //         return}
// // // // // // //       let ok=false;
// // // // // // //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// // // // // // //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// // // // // // //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // // // // //       goneR.current=[...goneR.current,i];
// // // // // // //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// // // // // // //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// // // // // // //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// // // // // // //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>onWin(r),l.mode==='away'?2200:900)}}
// // // // // // //     }}))).current;
// // // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // // // // // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // // // //         setOpen(true);
// // // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // // // //   return <Paper board={lv?.bg==='board'} title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // // //     <View style={[st.stage,lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // // // // //       {(lv.items||[]).map((it:any,i:number)=>{const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // // // // //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&it.drag)?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // // // // //         // multi-drag levels (clouds away / both cookies to the cat)
// // // // // // //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// // // // // // //         // tap-an-item levels only (NOT the counter / keypad levels)
// // // // // // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // // //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // // //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:140,alignItems:'center'}}><Text style={{fontSize:80,fontWeight:'900',color:'#1b6ef3'}}>10</Text></View>}
// // // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // // //     </View>
// // // // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // // // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // // // // // //       <View style={st.crow}>
// // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // // // // // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // // // // // //       </View>
// // // // // // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // // // // // //     </View>}
// // // // // // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // // // // // //       <View style={st.krow}>
// // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // // // // // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // // // // // //       </View>
// // // // // // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // // // // // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // // // // // //     </View>}
// // // // // // //     </>}
// // // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // // //   </Paper>}

// // // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||7))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // // //   if(scr==='ready')return <Paper hints={hints} onHome={onExit}><Text style={st.q}>ARE YOU READY TO TEST{'\n'}YOUR BRAIN?</Text>
// // // // // // //     <TouchableOpacity style={st.ready} onPress={()=>player&&setScr('level')}><Text style={st.rt}>READY</Text></TouchableOpacity>
// // // // // // //     {player&&<><Text style={st.pl}>OR PICK A LEVEL</Text>
// // // // // // //     <View style={st.picker}>{Array.from({length:player.total||7},(_,i)=>i+1).map(k=>{const ok=UNLOCK_ALL||k<=player.currentLevel;
// // // // // // //       return <TouchableOpacity key={k} disabled={!ok} onPress={()=>{setN(k);setWin(null);setScr('level')}} style={[st.pk,{opacity:ok?1:0.3}]}><Text style={st.pkt}>{k}</Text></TouchableOpacity>})}</View></>}
// // // // // // //     {!!err&&<Text style={st.err}>{err}</Text>}</Paper>;
// // // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // // const st=StyleSheet.create({
// // // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // // //   bwood:{backgroundColor:'#c9ced6'},bpaper:{backgroundColor:'#ffffff',borderWidth:6,borderColor:'#aab2bd',borderRadius:10},
// // // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // // //   q:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginBottom:22},
// // // // // // //   ready:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:28,paddingHorizontal:52,paddingVertical:14},rt:{fontFamily:F,fontSize:32,fontWeight:'bold',color:INK},
// // // // // // //   pl:{fontFamily:F,fontSize:13,color:'#777',marginTop:26,letterSpacing:1},
// // // // // // //   picker:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10,marginTop:10,maxWidth:300},
// // // // // // //   pk:{width:42,height:42,borderRadius:21,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},pkt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // // // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // // // // // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // // // // // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // // // // // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // // // // // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // // // // // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // // import Svg,{Rect,Path,Circle,Polygon,G} from 'react-native-svg';
// // // // // // import * as api from './api';
// // // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width,CREAM='#f6efe0';

// // // // // // /* ---------- chalkboard level art (drawn here, no change in Art.tsx) ---------- */
// // // // // // const Num=({w,t}:any)=><View style={{width:w,height:w,borderRadius:w/2,borderWidth:3,borderColor:'#e6c93c',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:w*0.55,fontWeight:'700',color:'#f4f2ea',includeFontPadding:false}}>{t}</Text></View>;
// // // // // // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // // // // // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;

// // // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // // // // // /* ---------- shared wooden UI pieces ---------- */
// // // // // // const WIcon=({n}:any)=><Svg width={20} height={20} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill={CREAM}/>
// // // // // //   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke={CREAM} strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke={CREAM} strokeWidth="2.6" fill="none"/></G>
// // // // // //   :<G><Circle cx="5" cy="12" r="2" fill={CREAM}/><Circle cx="12" cy="12" r="2" fill={CREAM}/><Circle cx="19" cy="12" r="2" fill={CREAM}/></G>}</Svg>;
// // // // // // const WBtn=({g,onPress}:any)=><TouchableOpacity onPress={onPress} style={bd.wbtn}><WIcon n={g}/></TouchableOpacity>;
// // // // // // const Coin=({s=18}:any)=><View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#f5c518',borderWidth:2,borderColor:'#c9970c'}}/>;
// // // // // // const CoinPill=({hints,onPlus}:any)=><View style={bd.pill}><Coin/><Text style={bd.pillt}>{hints}</Text>
// // // // // //   <TouchableOpacity onPress={onPlus} style={bd.plus}><Text style={bd.plust}>+</Text></TouchableOpacity></View>;
// // // // // // const SkipBtn=({onPress}:any)=><TouchableOpacity onPress={onPress} style={{alignItems:'center'}}>
// // // // // //   <View style={{flexDirection:'row',alignItems:'center',marginBottom:4}}><Coin s={16}/><Text style={bd.cost}> x50</Text></View>
// // // // // //   <View style={bd.ring}><View style={bd.skipin}><Svg width={26} height={26} viewBox="0 0 24 24"><Polygon points="7,4 20,12 7,20" fill="#fff"/></Svg></View></View></TouchableOpacity>;

// // // // // // /* ---------- READY screen (chalkboard + notebook card) ---------- */
// // // // // // function Ready({hints,onHome,onGo,err}:any){
// // // // // //   return <View style={rd.wrap}>
// // // // // //     <View style={rd.top}><WBtn g="home" onPress={onHome}/><WBtn g="gear"/><WBtn g="dots"/><View style={{flex:1}}/><CoinPill hints={hints}/></View>
// // // // // //     <View style={rd.card}>
// // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:80+i*34,backgroundColor:'#e3dcc6'}]}/>)}
// // // // // //       <View style={rd.holes}>{Array.from({length:12},(_,i)=><View key={i} style={rd.hole}/>)}</View>
// // // // // //       <View style={{marginTop:14}}><Brain w={86} p={100}/></View>
// // // // // //       <Text style={rd.title}>{'ARE YOU READY TO\nTEST YOUR BRAIN?'}</Text>
// // // // // //       <View style={rd.uline}/>
// // // // // //       <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
// // // // // //         <Svg width={26} height={26} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg><Text style={rd.btnt}>READY</Text></View></TouchableOpacity>
// // // // // //       {!!err&&<Text style={st.err}>{err}</Text>}
// // // // // //     </View>
// // // // // //     <View style={rd.desk}/>
// // // // // //     <View style={{position:'absolute',left:-8,bottom:56}}>
// // // // // //       {[['UNLOCK','#2f7a4a',160],['SOLVE','#a3412f',140],['THINK','#2f5d8c',150]].map(([t,c,w]:any)=>
// // // // // //         <View key={t} style={[rd.book,{backgroundColor:c,width:w}]}><Text style={rd.bookt}>{t}</Text></View>)}
// // // // // //     </View>
// // // // // //     <View style={{position:'absolute',right:34,bottom:34,width:80,height:16,borderRadius:7,backgroundColor:'#f3f0e6',transform:[{rotate:'-18deg'}]}}/>
// // // // // //   </View>}

// // // // // // /* ---------- old notebook paper (splash / win / other levels) ---------- */
// // // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // // //     <View style={st.paper}>
// // // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // // //     </View></View>);

// // // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // // //     </View></Paper>}

// // // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // // //   // choice level: tap an item (answer = item index)
// // // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // // //   // choice level with number options (answer = the number)
// // // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // // //   // levels with a counter (- / +) or a keypad: send the typed number
// // // // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // // // // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // // // //   // old tap-the-cloud level (kept so old data still works)
// // // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // // //   // multi-drag levels: every item with drag:true is dragged on its own
// // // // // //   //  mode 'combine' -> drop one item on another; sends {from,to} (smaller index first)
// // // // // //   //  mode 'away'    -> each one must be dragged away
// // // // // //   //  mode 'feed'    -> each one must be dropped on item lv.target
// // // // // //   const[merged,setMerged]=useState<any>(null);
// // // // // //   const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
// // // // // //   const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
// // // // // //     onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
// // // // // //     onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
// // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
// // // // // //       if(l.mode==='combine'){
// // // // // //         const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;
// // // // // //         const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&Math.hypot(cx-(o.x+o.w/2),cy-(o.y+o.w/2))<o.w*0.85);
// // // // // //         if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // // // //         const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
// // // // // //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52});setDone(true);setTimeout(()=>onWin(r),1500)}
// // // // // //         else{flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// // // // // //         return}
// // // // // //       let ok=false;
// // // // // //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// // // // // //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// // // // // //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // // // //       goneR.current=[...goneR.current,i];
// // // // // //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// // // // // //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// // // // // //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// // // // // //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>onWin(r),l.mode==='away'?2200:900)}}
// // // // // //     }}))).current;
// // // // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // // // // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // // //         setOpen(true);
// // // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // // //       else if(hit)flash('Open the fridge first!');
// // // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough coins':'Network error')}};

// // // // // //   const board=lv?.bg==='board';

// // // // // //   const stage=lv&&<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // // // //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// // // // // //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // // // //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&it.drag)?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // // // //         // multi-drag levels (combine numbers / clouds away / both cookies to the cat)
// // // // // //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// // // // // //         // tap-an-item levels only (NOT the counter / keypad levels)
// // // // // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // // //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // // //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,borderRadius:52,borderWidth:3,borderColor:'#e6c93c',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:64,fontWeight:'700',color:'#f4f2ea',includeFontPadding:false}}>10</Text></View>}
// // // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // // //     </View>;

// // // // // //   // ---------- chalkboard layout ----------
// // // // // //   if(board)return <View style={bd.wall}>
// // // // // //     <View style={bd.frame}><View style={bd.board}>
// // // // // //       <View style={bd.top}><WBtn g="home" onPress={onHome}/><WBtn g="gear"/><WBtn g="dots"/>
// // // // // //         <View style={bd.sign}><Text style={bd.signt}>{'LEVEL '+n}</Text></View>
// // // // // //         <CoinPill hints={hints} onPlus={()=>reward('video')}/></View>
// // // // // //       <Text style={bd.q}>{lv.question}</Text><View style={bd.uline}/>
// // // // // //       <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:70}}>{stage}</View>
// // // // // //       <View style={bd.ledge}>
// // // // // //         {(lv.items||[]).filter((it:any)=>it.k==='duster').map((it:any,i:number)=><View key={'d'+i} style={{position:'absolute',left:16,bottom:20}}><Duster w={it.w||100}/></View>)}
// // // // // //         {(lv.items||[]).filter((it:any)=>it.k==='chalk').map((it:any,i:number)=><View key={'c'+i} style={{position:'absolute',left:'56%',bottom:20}}><Chalk w={it.w||100}/></View>)}
// // // // // //       </View>
// // // // // //       {!!note&&<Text style={bd.note}>{note}</Text>}
// // // // // //     </View></View>
// // // // // //     <View style={bd.desk}><SkipBtn onPress={skip}/></View>
// // // // // //   </View>;

// // // // // //   // ---------- notebook layout (other levels) ----------
// // // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // // //     {stage}
// // // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // // // // //       <View style={st.crow}>
// // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // // // // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // // // // //       </View>
// // // // // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // // // // //     </View>}
// // // // // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // // // // //       <View style={st.krow}>
// // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // // // // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // // // // //       </View>
// // // // // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // // // // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // // // // //     </View>}
// // // // // //     </>}
// // // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // // //   </Paper>}

// // // // // // export default function BrainTwistFlow({onExit}:any){
// // // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||1))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // // //   if(scr==='ready')return <Ready hints={hints} onHome={onExit} err={err} onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;
// // // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // // /* ---------- chalkboard level styles ---------- */
// // // // // // const bd=StyleSheet.create({
// // // // // //   wall:{flex:1,backgroundColor:'#a98b63'},
// // // // // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#9c6a36',borderRadius:6,backgroundColor:'#2e5a47',overflow:'hidden'},
// // // // // //   board:{flex:1,alignItems:'center'},
// // // // // //   top:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,marginTop:8,paddingHorizontal:4},
// // // // // //   wbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',alignItems:'center',justifyContent:'center'},
// // // // // //   sign:{backgroundColor:'#7a4c25',borderWidth:2,borderColor:'#5b3a18',borderRadius:4,paddingHorizontal:10,paddingVertical:5,marginHorizontal:2},
// // // // // //   signt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:CREAM},
// // // // // //   pill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',borderRadius:18,paddingHorizontal:7,height:34},
// // // // // //   pillt:{fontFamily:F,fontSize:16,fontWeight:'bold',color:CREAM,minWidth:14,textAlign:'center'},
// // // // // //   plus:{width:20,height:20,borderRadius:10,backgroundColor:'#3f9a2f',alignItems:'center',justifyContent:'center'},plust:{color:'#fff',fontWeight:'bold',fontSize:15,lineHeight:18},
// // // // // //   q:{fontFamily:F,fontSize:30,color:'#f4f2ea',textAlign:'center',marginTop:20},
// // // // // //   uline:{width:210,height:3,borderRadius:2,backgroundColor:'rgba(255,255,255,0.55)',marginTop:4,transform:[{rotate:'-1deg'}]},
// // // // // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#a5703a',borderTopWidth:3,borderTopColor:'#c98d4d'},
// // // // // //   note:{position:'absolute',bottom:36,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// // // // // //   desk:{height:130,backgroundColor:'#a86f35',borderTopWidth:4,borderTopColor:'#8a5a2b',alignItems:'center',justifyContent:'center'},
// // // // // //   cost:{fontFamily:F,fontSize:17,fontWeight:'bold',color:CREAM},
// // // // // //   ring:{width:70,height:70,borderRadius:35,backgroundColor:'#7a4a22',borderWidth:3,borderColor:'#5b3a18',alignItems:'center',justifyContent:'center'},
// // // // // //   skipin:{width:54,height:54,borderRadius:27,backgroundColor:'#d93a46',alignItems:'center',justifyContent:'center'}});

// // // // // // /* ---------- READY screen styles ---------- */
// // // // // // const rd=StyleSheet.create({
// // // // // //   wrap:{flex:1,backgroundColor:'#2e5a47',paddingTop:34},
// // // // // //   top:{flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:8},
// // // // // //   card:{flex:1,marginHorizontal:16,marginTop:26,marginBottom:110,backgroundColor:'#f6ecd6',borderRadius:6,alignItems:'center',overflow:'hidden'},
// // // // // //   holes:{position:'absolute',top:2,left:0,right:0,flexDirection:'row',justifyContent:'space-around'},hole:{width:14,height:20,borderRadius:7,backgroundColor:'#2e5a47'},
// // // // // //   title:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginTop:14},
// // // // // //   uline:{width:200,height:4,borderRadius:2,backgroundColor:'#f5b82e',marginTop:6,marginBottom:34},
// // // // // //   btnOuter:{backgroundColor:'#7a4a22',borderRadius:34,padding:5},
// // // // // //   btnIn:{backgroundColor:'#3f9a2f',borderRadius:30,paddingHorizontal:40,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:10},
// // // // // //   btnt:{fontFamily:F,fontSize:34,fontWeight:'bold',color:'#fff'},
// // // // // //   desk:{position:'absolute',left:0,right:0,bottom:0,height:100,backgroundColor:'#a86f35',borderTopWidth:4,borderTopColor:'#8a5a2b'},
// // // // // //   book:{height:30,borderRadius:3,justifyContent:'center',paddingHorizontal:18,marginTop:2},bookt:{fontFamily:F,fontSize:12,fontWeight:'bold',color:'#f3e6c8'}});

// // // // // // const st=StyleSheet.create({
// // // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // // // // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // // // // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // // // // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // // // // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // // // // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // // import React,{useEffect,useRef,useState} from 'react';
// // // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // // import Svg,{Rect,Path,Circle,Polygon,Line,G} from 'react-native-svg';
// // // // // import * as api from './api';
// // // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width,CREAM='#f6efe0',CHALK='#f6f4ea';

// // // // // /* ---------- chalkboard level art (drawn here, no change in Art.tsx) ---------- */
// // // // // // big white chalk number (no circle)
// // // // // const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
// // // // //   <Text style={{fontFamily:F,fontSize:w*0.95,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// // // // // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // // // // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// // // // // // blue eraser (decoration on the board)
// // // // // const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// // // // // // green pencil (decoration on the board)
// // // // // const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// // // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // // // // /* ---------- shared wooden UI pieces (READY screen) ---------- */
// // // // // const WIcon=({n}:any)=><Svg width={20} height={20} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill={CREAM}/>
// // // // //   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke={CREAM} strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke={CREAM} strokeWidth="2.6" fill="none"/></G>
// // // // //   :<G><Circle cx="5" cy="12" r="2" fill={CREAM}/><Circle cx="12" cy="12" r="2" fill={CREAM}/><Circle cx="19" cy="12" r="2" fill={CREAM}/></G>}</Svg>;
// // // // // const WBtn=({g,onPress}:any)=><TouchableOpacity onPress={onPress} style={bd.wbtn}><WIcon n={g}/></TouchableOpacity>;
// // // // // const Coin=({s=18}:any)=><View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#f5c518',borderWidth:2,borderColor:'#c9970c'}}/>;
// // // // // const CoinPill=({hints,onPlus}:any)=><View style={bd.pill}><Coin/><Text style={bd.pillt}>{hints}</Text>
// // // // //   <TouchableOpacity onPress={onPlus} style={bd.plus}><Text style={bd.plust}>+</Text></TouchableOpacity></View>;

// // // // // /* ---------- READY screen (chalkboard + notebook card) ---------- */
// // // // // function Ready({hints,onHome,onGo,err}:any){
// // // // //   return <View style={rd.wrap}>
// // // // //     <View style={rd.top}><WBtn g="home" onPress={onHome}/><WBtn g="gear"/><WBtn g="dots"/><View style={{flex:1}}/><CoinPill hints={hints}/></View>
// // // // //     <View style={rd.card}>
// // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:80+i*34,backgroundColor:'#e3dcc6'}]}/>)}
// // // // //       <View style={rd.holes}>{Array.from({length:12},(_,i)=><View key={i} style={rd.hole}/>)}</View>
// // // // //       <View style={{marginTop:14}}><Brain w={86} p={100}/></View>
// // // // //       <Text style={rd.title}>{'ARE YOU READY TO\nTEST YOUR BRAIN?'}</Text>
// // // // //       <View style={rd.uline}/>
// // // // //       <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
// // // // //         <Svg width={26} height={26} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg><Text style={rd.btnt}>READY</Text></View></TouchableOpacity>
// // // // //       {!!err&&<Text style={st.err}>{err}</Text>}
// // // // //     </View>
// // // // //     <View style={rd.desk}/>
// // // // //     <View style={{position:'absolute',left:-8,bottom:56}}>
// // // // //       {[['UNLOCK','#2f7a4a',160],['SOLVE','#a3412f',140],['THINK','#2f5d8c',150]].map(([t,c,w]:any)=>
// // // // //         <View key={t} style={[rd.book,{backgroundColor:c,width:w}]}><Text style={rd.bookt}>{t}</Text></View>)}
// // // // //     </View>
// // // // //     <View style={{position:'absolute',right:34,bottom:34,width:80,height:16,borderRadius:7,backgroundColor:'#f3f0e6',transform:[{rotate:'-18deg'}]}}/>
// // // // //   </View>}

// // // // // /* ---------- old notebook paper (splash / win / other levels) ---------- */
// // // // // const Round=({n,onPress}:any)=><TouchableOpacity onPress={onPress} style={st.round}><Icon n={n} s={16}/></TouchableOpacity>;
// // // // // const Paper=({title,hints,onHome,bottom,children}:any)=>(
// // // // //   <View style={st.wood}><View style={st.pink}/>
// // // // //     <View style={st.paper}>
// // // // //       <View style={st.holes}>{Array.from({length:12},(_,i)=><View key={i} style={st.hole}/>)}</View>
// // // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:90+i*40}]}/>)}
// // // // //       <View style={st.head}><Round n="home" onPress={onHome}/><Round n="gear"/><Round n="dots"/>
// // // // //         {title?<Text style={st.title}>{title}</Text>:<View style={{width:60}}/>}
// // // // //         <View style={st.pill}><Text style={st.pn}>{hints}</Text><Icon n="bulb" s={16}/></View></View>
// // // // //       <View style={st.body}>{children}</View>{bottom}
// // // // //     </View></View>);

// // // // // const Bar=({onHint,onGift,onVideo,onSkip}:any)=><View style={st.bar}>{[['search','x25',onHint,'#bdeaf2'],['gift','',onGift,'transparent'],['film','+75',onVideo,'#d9bff7'],['play','x50',onSkip,'#f4a0a0']].map(([n,c,f,bg]:any)=>
// // // // //   <TouchableOpacity key={n} onPress={f} style={{alignItems:'center'}}><View style={{flexDirection:'row',height:20,alignItems:'center'}}>{c?<><Icon n="bulb" s={16}/><Text style={st.cost}>{c}</Text></>:null}</View>
// // // // //     <View style={[st.bcircle,{backgroundColor:bg,borderColor:n==='gift'?'transparent':INK}]}><Icon n={n} s={24}/></View></TouchableOpacity>)}</View>;

// // // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // // //     </View></Paper>}

// // // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // // //   // choice level: tap an item (answer = item index)
// // // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // // //   // choice level with number options (answer = the number)
// // // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // // //   // levels with a counter (- / +) or a keypad: send the typed number
// // // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // // // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // // //   // old tap-the-cloud level (kept so old data still works)
// // // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // // //   // multi-drag levels: every item with drag:true is dragged on its own
// // // // //   //  mode 'combine' -> drop one item on another; sends {from,to} (smaller index first)
// // // // //   //  mode 'away'    -> each one must be dragged away
// // // // //   //  mode 'feed'    -> each one must be dropped on item lv.target
// // // // //   const[merged,setMerged]=useState<any>(null);
// // // // //   const goneR=useRef<number[]>([]),dPan=useRef(Array.from({length:10},()=>new Animated.ValueXY())).current,dSc=useRef(Array.from({length:10},()=>new Animated.Value(1))).current;
// // // // //   const dPR=useRef(Array.from({length:10},(_,i)=>PanResponder.create({
// // // // //     onStartShouldSetPanResponder:()=>!goneR.current.includes(i),onPanResponderGrant:()=>setHand(false),
// // // // //     onPanResponderMove:Animated.event([null,{dx:dPan[i].x,dy:dPan[i].y}],{useNativeDriver:false}),
// // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current;if(!l)return;const to=l.target??1,el=l.items[i],fr=l.items[to];
// // // // //       if(l.mode==='combine'){
// // // // //         const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;
// // // // //         const j=l.items.findIndex((o:any,k:number)=>k!==i&&o.drag&&Math.hypot(cx-(o.x+o.w/2),cy-(o.y+o.w/2))<o.w*0.85);
// // // // //         if(j<0){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // // //         const a=Math.min(i,j),b=Math.max(i,j),A=l.items[a],B=l.items[b],r=await send({from:a,to:b});
// // // // //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52});setDone(true);setTimeout(()=>onWin(r),1500)}
// // // // //         else{flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// // // // //         return}
// // // // //       let ok=false;
// // // // //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// // // // //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// // // // //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // // //       goneR.current=[...goneR.current,i];
// // // // //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// // // // //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// // // // //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// // // // //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>onWin(r),l.mode==='away'?2200:900)}}
// // // // //     }}))).current;
// // // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // // // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // // //         setOpen(true);
// // // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // // //         setTimeout(()=>onWin(r),1100);return}}
// // // // //       else if(hit)flash('Open the fridge first!');
// // // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // // //   const board=lv?.bg==='board';

// // // // //   const stage=lv&&<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // // //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// // // // //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // // //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&it.drag)?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // // //         // multi-drag levels (combine numbers / clouds away / both cookies to the cat)
// // // // //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// // // // //         // tap-an-item levels only (NOT the counter / keypad levels)
// // // // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // // //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // // //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>10</Text></View>}
// // // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // // //     </View>;

// // // // //   // ---------- chalkboard layout (same look as the reference design) ----------
// // // // //   if(board)return <View style={bd.wall}>
// // // // //     <View style={bd.frame}><View style={bd.board}>
// // // // //       {/* chalk dust smudges */}
// // // // //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// // // // //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// // // // //       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>

// // // // //       {/* top bar: home + gear | hanging LEVEL sign | bulb counter */}
// // // // //       <View style={bd.top}>
// // // // //         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
// // // // //         <View style={bd.signWrap}>
// // // // //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // // // //           <View style={bd.sign}>
// // // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // // // //             <Text style={bd.signt}>{'LEVEL '+n}</Text>
// // // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // // // //           </View>
// // // // //         </View>
// // // // //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // // // //       </View>

// // // // //       <Text style={bd.q}>{lv.question}</Text>

// // // // //       <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240}}>{stage}</View>

// // // // //       {/* eraser + pencil decoration */}
// // // // //       <View pointerEvents="none" style={bd.decor}>
// // // // //         <View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View>
// // // // //         <View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View>
// // // // //       </View>

// // // // //       {/* hint / video / skip buttons */}
// // // // //       <View style={bd.actions}>
// // // // //         <TouchableOpacity onPress={hint} activeOpacity={0.85} style={bd.hintBtn}><Icon n="search" s={34}/></TouchableOpacity>
// // // // //         <TouchableOpacity onPress={()=>reward('video')} activeOpacity={0.85} style={bd.videoBtn}>
// // // // //           <Icon n="film" s={40}/>
// // // // //           <View style={bd.vlabel}><Coin s={12}/><Text style={bd.vlt}>+75</Text></View>
// // // // //         </TouchableOpacity>
// // // // //         <TouchableOpacity onPress={skip} activeOpacity={0.85} style={bd.skipBtn}><Icon n="play" s={36}/></TouchableOpacity>
// // // // //       </View>

// // // // //       {/* wooden ledge with duster + chalk */}
// // // // //       <View style={bd.ledge}>
// // // // //         {(lv.items||[]).filter((it:any)=>it.k==='duster').map((it:any,i:number)=><View key={'d'+i} style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>)}
// // // // //         {(lv.items||[]).filter((it:any)=>it.k==='chalk').map((it:any,i:number)=><View key={'c'+i} style={{position:'absolute',left:'38%',bottom:20}}><Chalk w={90}/></View>)}
// // // // //       </View>
// // // // //       {!!note&&<Text style={bd.note}>{note}</Text>}
// // // // //     </View></View>
// // // // //     <View style={bd.wallBottom}/>
// // // // //   </View>;

// // // // //   // ---------- notebook layout (other levels) ----------
// // // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // // //     {stage}
// // // // //     {lv.options&&<View style={st.opts}>{lv.options.map((o:number)=>
// // // // //       <TouchableOpacity key={o} disabled={done||hidOpt.includes(o)} onPress={()=>pickOpt(o)}
// // // // //         style={[st.opt,{backgroundColor:sel===o?GREEN:'#fff',opacity:hidOpt.includes(o)?0.2:1}]}><Text style={st.ot}>{o}</Text></TouchableOpacity>)}</View>}
// // // // //     {lv.input==='counter'&&<View style={st.cwrap}>
// // // // //       <View style={st.crow}>
// // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.max(0,c-1))}><Text style={st.cbt}>−</Text></TouchableOpacity>
// // // // //         <View style={st.cnumBox}><Text style={st.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={64}/></View>}</View>
// // // // //         <TouchableOpacity style={st.cbtn} onPress={()=>setCount(c=>Math.min(99,c+1))}><Text style={st.cbt}>+</Text></TouchableOpacity>
// // // // //       </View>
// // // // //       <TouchableOpacity style={st.submit} disabled={done} onPress={()=>submitNum(count)}><Text style={st.subt}>SUBMIT</Text></TouchableOpacity>
// // // // //     </View>}
// // // // //     {lv.input==='keypad'&&<View style={st.kwrap}>
// // // // //       <View style={st.krow}>
// // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#e8523f'}]} onPress={()=>setTyped('')}><Text style={st.kst}>✕</Text></TouchableOpacity>
// // // // //         <View style={st.kpill}><Text style={st.knum}>{typed}</Text>{!!ov&&<View pointerEvents="none" style={st.cov}><Icon n={ov} s={52}/></View>}</View>
// // // // //         <TouchableOpacity style={[st.kside,{backgroundColor:'#b6ef63',opacity:typed?1:0.5}]} disabled={!typed||done} onPress={()=>submitNum(Number(typed))}><Text style={st.kst}>✓</Text></TouchableOpacity>
// // // // //       </View>
// // // // //       {[[0,1,2,3,4],[5,6,7,8,9]].map(row=><View key={row[0]} style={st.krow}>{row.map(d=>
// // // // //         <TouchableOpacity key={d} style={st.kd} disabled={done} onPress={()=>setTyped(x=>((x==='0'?'':x)+d).slice(0,2))}><Text style={st.kdt}>{d}</Text></TouchableOpacity>)}</View>)}
// // // // //     </View>}
// // // // //     </>}
// // // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // // //   </Paper>}

// // // // // export default function BrainTwistFlow({onExit}:any){
// // // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||1))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // // //   if(scr==='ready')return <Ready hints={hints} onHome={onExit} err={err} onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;
// // // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // // /* ---------- chalkboard level styles ---------- */
// // // // // const bd=StyleSheet.create({
// // // // //   wall:{flex:1,backgroundColor:'#f1dcc0'},
// // // // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:6,backgroundColor:'#1f5b44',overflow:'hidden'},
// // // // //   board:{flex:1,alignItems:'center'},
// // // // //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
// // // // //   top:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginTop:6,paddingHorizontal:8,width:'100%'},
// // // // //   topL:{flexDirection:'row',gap:6,minWidth:80,marginTop:10},
// // // // //   topR:{minWidth:80,alignItems:'flex-end',marginTop:14,paddingRight:14},
// // // // //   signWrap:{alignItems:'center',paddingTop:14},
// // // // //   string:{position:'absolute',top:-6,width:2,height:22,backgroundColor:'#6b4a2a'},
// // // // //   sign:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#8a5a2e',borderWidth:3,borderColor:'#c98d4d',borderRadius:6,paddingHorizontal:10,paddingVertical:6},
// // // // //   signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
// // // // //   dashes:{gap:4,justifyContent:'center'},dash:{width:10,height:3,borderRadius:2,backgroundColor:'#ffd84d'},
// // // // //   bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:58,paddingLeft:12,paddingRight:18,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
// // // // //   bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},
// // // // //   q:{fontFamily:F,fontSize:30,color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// // // // //   decor:{position:'absolute',left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
// // // // //   actions:{position:'absolute',left:0,right:0,bottom:84,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:34},
// // // // //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // // // //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // //   vlabel:{position:'absolute',bottom:-14,right:-14,flexDirection:'row',alignItems:'center',gap:2},
// // // // //   vlt:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// // // // //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
// // // // //   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// // // // //   wallBottom:{height:18},
// // // // //   wbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',alignItems:'center',justifyContent:'center'},
// // // // //   pill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',borderRadius:18,paddingHorizontal:7,height:34},
// // // // //   pillt:{fontFamily:F,fontSize:16,fontWeight:'bold',color:CREAM,minWidth:14,textAlign:'center'},
// // // // //   plus:{width:20,height:20,borderRadius:10,backgroundColor:'#3f9a2f',alignItems:'center',justifyContent:'center'},plust:{color:'#fff',fontWeight:'bold',fontSize:15,lineHeight:18}});

// // // // // /* ---------- READY screen styles ---------- */
// // // // // const rd=StyleSheet.create({
// // // // //   wrap:{flex:1,backgroundColor:'#2e5a47',paddingTop:34},
// // // // //   top:{flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:8},
// // // // //   card:{flex:1,marginHorizontal:16,marginTop:26,marginBottom:110,backgroundColor:'#f6ecd6',borderRadius:6,alignItems:'center',overflow:'hidden'},
// // // // //   holes:{position:'absolute',top:2,left:0,right:0,flexDirection:'row',justifyContent:'space-around'},hole:{width:14,height:20,borderRadius:7,backgroundColor:'#2e5a47'},
// // // // //   title:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginTop:14},
// // // // //   uline:{width:200,height:4,borderRadius:2,backgroundColor:'#f5b82e',marginTop:6,marginBottom:34},
// // // // //   btnOuter:{backgroundColor:'#7a4a22',borderRadius:34,padding:5},
// // // // //   btnIn:{backgroundColor:'#3f9a2f',borderRadius:30,paddingHorizontal:40,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:10},
// // // // //   btnt:{fontFamily:F,fontSize:34,fontWeight:'bold',color:'#fff'},
// // // // //   desk:{position:'absolute',left:0,right:0,bottom:0,height:100,backgroundColor:'#a86f35',borderTopWidth:4,borderTopColor:'#8a5a2b'},
// // // // //   book:{height:30,borderRadius:3,justifyContent:'center',paddingHorizontal:18,marginTop:2},bookt:{fontFamily:F,fontSize:12,fontWeight:'bold',color:'#f3e6c8'}});

// // // // // const st=StyleSheet.create({
// // // // //   wood:{flex:1,backgroundColor:'#e8c9a0',padding:10,paddingTop:34},pink:{position:'absolute',left:0,top:0,bottom:0,width:8,backgroundColor:'#f08a8a'},
// // // // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:5},
// // // // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},hole:{width:16,height:22,borderRadius:8,backgroundColor:'#e8c9a0'},
// // // // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e3f0ee'},
// // // // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:6},
// // // // //   round:{width:30,height:30,borderRadius:15,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // // // //   title:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK,marginHorizontal:12},
// // // // //   pill:{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:INK,borderRadius:14,paddingHorizontal:8,backgroundColor:'#fff',height:26},pn:{fontFamily:F,fontWeight:'bold',marginRight:3,color:INK},
// // // // //   body:{flex:1,alignItems:'center',justifyContent:'center',padding:8},
// // // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
// // // // //   ql:{fontFamily:F,fontSize:17,color:'#444',textAlign:'center',position:'absolute',top:6},
// // // // //   stage:{width:320,height:300,marginTop:20},note:{position:'absolute',bottom:6,fontFamily:F,fontSize:17,color:'#c0392b'},
// // // // //   opts:{flexDirection:'row',gap:12,marginTop:6},
// // // // //   opt:{width:54,height:54,borderRadius:16,borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},ot:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK},
// // // // //   cwrap:{alignItems:'center',marginTop:4},crow:{flexDirection:'row',alignItems:'center',gap:14},
// // // // //   cbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#5ba8d0',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},cbt:{fontFamily:F,fontSize:26,fontWeight:'bold',color:INK,lineHeight:30},
// // // // //   cnumBox:{minWidth:60,height:44,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:34,fontWeight:'bold',color:INK},cov:{position:'absolute',left:0,right:0,top:-8,alignItems:'center'},
// // // // //   submit:{marginTop:12,paddingHorizontal:26,paddingVertical:8,borderRadius:18,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff'},subt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:INK},
// // // // //   kwrap:{alignItems:'center',gap:10,marginTop:-60},krow:{flexDirection:'row',alignItems:'center',gap:8},
// // // // //   kside:{width:36,height:36,borderRadius:18,borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},kst:{fontSize:20,fontWeight:'bold',color:INK},
// // // // //   kpill:{width:130,height:54,borderRadius:27,borderWidth:2.5,borderColor:INK,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginHorizontal:6},knum:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // //   kd:{width:44,height:44,borderRadius:22,borderWidth:2.5,borderColor:INK,backgroundColor:'#d9d9d9',alignItems:'center',justifyContent:'center'},kdt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:INK},
// // // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // // import React,{useEffect,useRef,useState} from 'react';
// // // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // // import Svg,{Rect,Path,Circle,Polygon,Line,G} from 'react-native-svg';
// // // // import * as api from './api';
// // // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // // import {CelebrationHands,PointerHand} from './CelebrationHands';

// // // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width,CREAM='#f6efe0',CHALK='#f6f4ea';

// // // // /* ---------- chalkboard level art (drawn here, no change in Art.tsx) ---------- */
// // // // // big white chalk number (no circle)
// // // // const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
// // // //   <Text style={{fontFamily:F,fontSize:w*0.95,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// // // // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // // // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// // // // // blue eraser (decoration on the board)
// // // // const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// // // // // green pencil (decoration on the board)
// // // // const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// // // // // free drag: the item moves with the finger and stays where it is dropped
// // // // function FreeDrag({children}:any){
// // // //   const pan=useRef(new Animated.ValueXY()).current;
// // // //   const pr=useRef(PanResponder.create({
// // // //     onStartShouldSetPanResponder:()=>true,
// // // //     onPanResponderGrant:()=>{pan.extractOffset()},
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
// // // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // // // /* ---------- shared wooden UI pieces (READY screen) ---------- */
// // // // const WIcon=({n}:any)=><Svg width={20} height={20} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill={CREAM}/>
// // // //   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke={CREAM} strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke={CREAM} strokeWidth="2.6" fill="none"/></G>
// // // //   :<G><Circle cx="5" cy="12" r="2" fill={CREAM}/><Circle cx="12" cy="12" r="2" fill={CREAM}/><Circle cx="19" cy="12" r="2" fill={CREAM}/></G>}</Svg>;
// // // // const WBtn=({g,onPress}:any)=><TouchableOpacity onPress={onPress} style={bd.wbtn}><WIcon n={g}/></TouchableOpacity>;
// // // // const Coin=({s=18}:any)=><View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#f5c518',borderWidth:2,borderColor:'#c9970c'}}/>;
// // // // const CoinPill=({hints,onPlus}:any)=><View style={bd.pill}><Coin/><Text style={bd.pillt}>{hints}</Text>
// // // //   <TouchableOpacity onPress={onPlus} style={bd.plus}><Text style={bd.plust}>+</Text></TouchableOpacity></View>;

// // // // /* ---------- READY screen (chalkboard + notebook card) ---------- */
// // // // function Ready({hints,onHome,onGo,err}:any){
// // // //   return <View style={rd.wrap}>
// // // //     <View style={rd.top}><WBtn g="home" onPress={onHome}/><WBtn g="gear"/><WBtn g="dots"/><View style={{flex:1}}/><CoinPill hints={hints}/></View>
// // // //     <View style={rd.card}>
// // // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:80+i*34,backgroundColor:'#e3dcc6'}]}/>)}
// // // //       <View style={rd.holes}>{Array.from({length:12},(_,i)=><View key={i} style={rd.hole}/>)}</View>
// // // //       <View style={{marginTop:14}}><Brain w={86} p={100}/></View>
// // // //       <Text style={rd.title}>{'ARE YOU READY TO\nTEST YOUR BRAIN?'}</Text>
// // // //       <View style={rd.uline}/>
// // // //       <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
// // // //         <Svg width={26} height={26} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg><Text style={rd.btnt}>READY</Text></View></TouchableOpacity>
// // // //       {!!err&&<Text style={st.err}>{err}</Text>}
// // // //     </View>
// // // //     <View style={rd.desk}/>
// // // //     <View style={{position:'absolute',left:-8,bottom:56}}>
// // // //       {[['UNLOCK','#2f7a4a',160],['SOLVE','#a3412f',140],['THINK','#2f5d8c',150]].map(([t,c,w]:any)=>
// // // //         <View key={t} style={[rd.book,{backgroundColor:c,width:w}]}><Text style={rd.bookt}>{t}</Text></View>)}
// // // //     </View>
// // // //     <View style={{position:'absolute',right:34,bottom:34,width:80,height:16,borderRadius:7,backgroundColor:'#f3f0e6',transform:[{rotate:'-18deg'}]}}/>
// // // //   </View>}

// // // // /* ---------- old notebook paper (splash / win / other levels) ---------- */
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

// // // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome}><Confetti/><Text style={st.msg}>{msg}</Text>
// // // //     <TouchableOpacity style={st.next} onPress={onNext}><Text style={st.nt}>{hasNext?'NEXT':'DONE'}</Text></TouchableOpacity>
// // // //     <View pointerEvents="none" style={{position:'absolute',bottom:0,left:0,right:0,alignItems:'center'}}>
// // // //       <CelebrationHands variant={hasNext?'clap':'tips'} width={Math.min(W-30,340)}/>
// // // //     </View></Paper>}

// // // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // // //   // choice level: tap an item (answer = item index)
// // // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // // //   // choice level with number options (answer = the number)
// // // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // // //   // levels with a counter (- / +) or a keypad: send the typed number
// // // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // // //   // old tap-the-cloud level (kept so old data still works)
// // // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // // //   // multi-drag levels: every item with drag:true is dragged on its own
// // // //   //  mode 'combine' -> drop one item on another; sends {from,to} (smaller index first)
// // // //   //  mode 'away'    -> each one must be dragged away
// // // //   //  mode 'feed'    -> each one must be dropped on item lv.target
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
// // // //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>onWin(r),1500)}
// // // //         else{flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// // // //         return}
// // // //       let ok=false;
// // // //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// // // //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// // // //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // // //       goneR.current=[...goneR.current,i];
// // // //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// // // //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// // // //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// // // //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>onWin(r),l.mode==='away'?2200:900)}}
// // // //     }}))).current;
// // // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // // //         setOpen(true);
// // // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // // //         setTimeout(()=>onWin(r),1100);return}}
// // // //       else if(hit)flash('Open the fridge first!');
// // // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // // //   const board=lv?.bg==='board';

// // // //   const stage=lv&&<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // // //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// // // //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // // //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // // //         // multi-drag levels (combine numbers / clouds away / both cookies to the cat)
// // // //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// // // //         // tap-an-item levels only (NOT the counter / keypad levels)
// // // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // // //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // // //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
// // // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // // //     </View>;

// // // //   // ---------- chalkboard layout (same look as the reference design) ----------
// // // //   if(board)return <View style={bd.wall}>
// // // //     <View style={bd.frame}><View style={bd.board}>
// // // //       {/* chalk dust smudges */}
// // // //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// // // //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// // // //       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>

// // // //       {/* top bar: home + gear | hanging LEVEL sign | bulb counter */}
// // // //       <View style={bd.top}>
// // // //         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
// // // //         <View style={bd.signWrap}>
// // // //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // // //           <View style={bd.sign}>
// // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // // //             <Text style={bd.signt}>{'LEVEL '+n}</Text>
// // // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // // //           </View>
// // // //         </View>
// // // //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // // //       </View>

// // // //       <Text style={bd.q}>{lv.question}</Text>

// // // //       <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240}}>{stage}</View>

// // // //       {/* eraser + pencil decoration */}
// // // //       <View pointerEvents="box-none" style={bd.decor}>
// // // //         <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
// // // //         <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
// // // //       </View>

// // // //       {/* hint / video / skip buttons */}
// // // //       <View style={bd.actions}>
// // // //         <TouchableOpacity onPress={hint} activeOpacity={0.85} style={bd.hintBtn}><Icon n="search" s={34}/></TouchableOpacity>
// // // //         <TouchableOpacity onPress={()=>reward('video')} activeOpacity={0.85} style={bd.videoBtn}>
// // // //           <Icon n="film" s={40}/>
// // // //           <View style={bd.vlabel}><Coin s={12}/><Text style={bd.vlt}>+75</Text></View>
// // // //         </TouchableOpacity>
// // // //         <TouchableOpacity onPress={skip} activeOpacity={0.85} style={bd.skipBtn}><Icon n="play" s={36}/></TouchableOpacity>
// // // //       </View>

// // // //       {/* wooden ledge with duster + chalk */}
// // // //       <View style={bd.ledge}>
// // // //         {(lv.items||[]).filter((it:any)=>it.k==='duster').map((it:any,i:number)=><View key={'d'+i} style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>)}
// // // //         {(lv.items||[]).filter((it:any)=>it.k==='chalk').map((it:any,i:number)=><View key={'c'+i} style={{position:'absolute',left:'38%',bottom:20}}><Chalk w={90}/></View>)}
// // // //       </View>
// // // //       {!!note&&<Text style={bd.note}>{note}</Text>}
// // // //     </View></View>
// // // //     <View style={bd.wallBottom}/>
// // // //   </View>;

// // // //   // ---------- notebook layout (other levels) ----------
// // // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // // //     {stage}
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
// // // //     </>}
// // // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // // //   </Paper>}

// // // // export default function BrainTwistFlow({onExit}:any){
// // // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||1))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // // //   if(scr==='ready')return <Ready hints={hints} onHome={onExit} err={err} onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;
// // // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // // /* ---------- chalkboard level styles ---------- */
// // // // const bd=StyleSheet.create({
// // // //   wall:{flex:1,backgroundColor:'#f1dcc0'},
// // // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:6,backgroundColor:'#1f5b44',overflow:'hidden'},
// // // //   board:{flex:1,alignItems:'center'},
// // // //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
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
// // // //   q:{fontFamily:F,fontSize:23,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// // // //   decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
// // // //   actions:{position:'absolute',left:0,right:0,bottom:84,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:34},
// // // //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // // //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // //   vlabel:{position:'absolute',bottom:-14,right:-14,flexDirection:'row',alignItems:'center',gap:2},
// // // //   vlt:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// // // //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
// // // //   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// // // //   wallBottom:{height:18},
// // // //   wbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',alignItems:'center',justifyContent:'center'},
// // // //   pill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',borderRadius:18,paddingHorizontal:7,height:34},
// // // //   pillt:{fontFamily:F,fontSize:16,fontWeight:'bold',color:CREAM,minWidth:14,textAlign:'center'},
// // // //   plus:{width:20,height:20,borderRadius:10,backgroundColor:'#3f9a2f',alignItems:'center',justifyContent:'center'},plust:{color:'#fff',fontWeight:'bold',fontSize:15,lineHeight:18}});

// // // // /* ---------- READY screen styles ---------- */
// // // // const rd=StyleSheet.create({
// // // //   wrap:{flex:1,backgroundColor:'#2e5a47',paddingTop:34},
// // // //   top:{flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:8},
// // // //   card:{flex:1,marginHorizontal:16,marginTop:26,marginBottom:110,backgroundColor:'#f6ecd6',borderRadius:6,alignItems:'center',overflow:'hidden'},
// // // //   holes:{position:'absolute',top:2,left:0,right:0,flexDirection:'row',justifyContent:'space-around'},hole:{width:14,height:20,borderRadius:7,backgroundColor:'#2e5a47'},
// // // //   title:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginTop:14},
// // // //   uline:{width:200,height:4,borderRadius:2,backgroundColor:'#f5b82e',marginTop:6,marginBottom:34},
// // // //   btnOuter:{backgroundColor:'#7a4a22',borderRadius:34,padding:5},
// // // //   btnIn:{backgroundColor:'#3f9a2f',borderRadius:30,paddingHorizontal:40,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:10},
// // // //   btnt:{fontFamily:F,fontSize:34,fontWeight:'bold',color:'#fff'},
// // // //   desk:{position:'absolute',left:0,right:0,bottom:0,height:100,backgroundColor:'#a86f35',borderTopWidth:4,borderTopColor:'#8a5a2b'},
// // // //   book:{height:30,borderRadius:3,justifyContent:'center',paddingHorizontal:18,marginTop:2},bookt:{fontFamily:F,fontSize:12,fontWeight:'bold',color:'#f3e6c8'}});

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
// // // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
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
// // // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // // import React,{useEffect,useRef,useState} from 'react';
// // // import {View,Text,TouchableOpacity,Animated,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // // import Svg,{Rect,Path,Circle,Polygon,Line,G,Ellipse} from 'react-native-svg';
// // // import * as api from './api';
// // // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // // import {PointerHand} from './CelebrationHands';

// // // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width,CREAM='#f6efe0',CHALK='#f6f4ea';

// // // /* ---------- chalkboard level art (drawn here, no change in Art.tsx) ---------- */
// // // // big white chalk number (no circle)
// // // const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
// // //   <Text style={{fontFamily:F,fontSize:w*0.95,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// // // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// // // // blue eraser (decoration on the board)
// // // const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// // // // green pencil (decoration on the board)
// // // const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// // // // free drag: the item moves with the finger and stays where it is dropped
// // // function FreeDrag({children}:any){
// // //   const pan=useRef(new Animated.ValueXY()).current;
// // //   const pr=useRef(PanResponder.create({
// // //     onStartShouldSetPanResponder:()=>true,
// // //     onPanResponderGrant:()=>{pan.extractOffset()},
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
// // //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // // /* ---------- shared wooden UI pieces (READY screen) ---------- */
// // // const WIcon=({n}:any)=><Svg width={20} height={20} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill={CREAM}/>
// // //   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke={CREAM} strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke={CREAM} strokeWidth="2.6" fill="none"/></G>
// // //   :<G><Circle cx="5" cy="12" r="2" fill={CREAM}/><Circle cx="12" cy="12" r="2" fill={CREAM}/><Circle cx="19" cy="12" r="2" fill={CREAM}/></G>}</Svg>;
// // // const WBtn=({g,onPress}:any)=><TouchableOpacity onPress={onPress} style={bd.wbtn}><WIcon n={g}/></TouchableOpacity>;
// // // const Coin=({s=18}:any)=><View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#f5c518',borderWidth:2,borderColor:'#c9970c'}}/>;
// // // const CoinPill=({hints,onPlus}:any)=><View style={bd.pill}><Coin/><Text style={bd.pillt}>{hints}</Text>
// // //   <TouchableOpacity onPress={onPlus} style={bd.plus}><Text style={bd.plust}>+</Text></TouchableOpacity></View>;

// // // /* ---------- READY screen (chalkboard + notebook card) ---------- */
// // // function Ready({hints,onHome,onGo,err}:any){
// // //   return <View style={rd.wrap}>
// // //     <View style={rd.top}><WBtn g="home" onPress={onHome}/><WBtn g="gear"/><WBtn g="dots"/><View style={{flex:1}}/><CoinPill hints={hints}/></View>
// // //     <View style={rd.card}>
// // //       {Array.from({length:13},(_,i)=><View key={i} style={[st.ln,{top:80+i*34,backgroundColor:'#e3dcc6'}]}/>)}
// // //       <View style={rd.holes}>{Array.from({length:12},(_,i)=><View key={i} style={rd.hole}/>)}</View>
// // //       <View style={{marginTop:14}}><Brain w={86} p={100}/></View>
// // //       <Text style={rd.title}>{'ARE YOU READY TO\nTEST YOUR BRAIN?'}</Text>
// // //       <View style={rd.uline}/>
// // //       <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
// // //         <Svg width={26} height={26} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg><Text style={rd.btnt}>READY</Text></View></TouchableOpacity>
// // //       {!!err&&<Text style={st.err}>{err}</Text>}
// // //     </View>
// // //     <View style={rd.desk}/>
// // //     <View style={{position:'absolute',left:-8,bottom:56}}>
// // //       {[['UNLOCK','#2f7a4a',160],['SOLVE','#a3412f',140],['THINK','#2f5d8c',150]].map(([t,c,w]:any)=>
// // //         <View key={t} style={[rd.book,{backgroundColor:c,width:w}]}><Text style={rd.bookt}>{t}</Text></View>)}
// // //     </View>
// // //     <View style={{position:'absolute',right:34,bottom:34,width:80,height:16,borderRadius:7,backgroundColor:'#f3f0e6',transform:[{rotate:'-18deg'}]}}/>
// // //   </View>}

// // // /* ---------- old notebook paper (splash / other levels) ---------- */
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

// // // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// // //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// // //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // // function Splash({onDone}:any){const[p,setP]=useState(0);
// // //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// // //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// // //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // // /* ---------- WIN screen art (drawn here, animated) ---------- */
// // // // cartoon brain with glasses, thumbs up and blue shoes
// // // const BrainHero=({w}:any)=><Svg width={w} height={w*0.95} viewBox="0 0 200 190">
// // //   {/* shadow */}
// // //   <Ellipse cx="100" cy="184" rx="62" ry="6" fill="#d9cdf0"/>
// // //   {/* legs + shoes */}
// // //   <Line x1="86" y1="148" x2="84" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
// // //   <Line x1="114" y1="148" x2="116" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
// // //   <Ellipse cx="80" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
// // //   <Ellipse cx="120" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
// // //   <Path d="M70 174 H90 M110 174 H130" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
// // //   {/* arms */}
// // //   <Path d="M52 112 Q36 106 30 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
// // //   <Path d="M148 112 Q164 106 170 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
// // //   {/* thumbs up hands */}
// // //   <Rect x="16" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// // //   <Rect x="22" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// // //   <Rect x="158" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// // //   <Rect x="169" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// // //   {/* brain outline */}
// // //   {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
// // //     <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
// // //   {/* brain fill (hides inner outlines) */}
// // //   {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
// // //     <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
// // //   <Path d="M78 52 Q90 62 82 74 M120 50 Q110 62 120 72 M58 92 Q70 98 64 110 M144 92 Q132 100 138 112" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
// // //   {/* cheeks */}
// // //   <Circle cx="62" cy="116" r="8" fill="#ff7a96" opacity="0.7"/><Circle cx="138" cy="116" r="8" fill="#ff7a96" opacity="0.7"/>
// // //   {/* glasses */}
// // //   <Circle cx="80" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
// // //   <Circle cx="120" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
// // //   <Path d="M99 96 Q100 92 101 96" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
// // //   {/* happy eyes */}
// // //   <Path d="M70 100 Q80 88 90 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
// // //   <Path d="M110 100 Q120 88 130 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
// // //   {/* open smile */}
// // //   <Path d="M88 122 Q100 142 112 122 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
// // //   <Path d="M93 130 Q100 137 107 130 Q100 126 93 130Z" fill="#ff8aa0"/>
// // // </Svg>;

// // // // yellow sparkle rays
// // // const Rays=({w,c='#ffd21f'}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
// // //   {[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180,x1=50+Math.cos(r)*40,y1=50+Math.sin(r)*40,x2=50+Math.cos(r)*49,y2=50+Math.sin(r)*49;
// // //     return <Line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="4" strokeLinecap="round"/>})}</Svg>;

// // // const StarDoodle=({w}:any)=><Svg width={w} height={w} viewBox="0 0 50 50">
// // //   <Polygon points="25,4 31,18 46,19 34,29 38,44 25,36 12,44 16,29 4,19 19,18" fill="#fff6b0" stroke="#f5b82e" strokeWidth="3" strokeLinejoin="round"/>
// // //   <Circle cx="21" cy="26" r="1.6" fill="#f5b82e"/><Circle cx="29" cy="26" r="1.6" fill="#f5b82e"/><Path d="M21 31 Q25 34 29 31" stroke="#f5b82e" strokeWidth="1.6" fill="none"/></Svg>;

// // // const Smiley=({w}:any)=><Svg width={w} height={w} viewBox="0 0 40 40"><Circle cx="14" cy="15" r="2" fill={INK}/><Circle cx="26" cy="15" r="2" fill={INK}/><Path d="M10 24 Q20 34 30 24" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round"/></Svg>;

// // // const CHEERS=[
// // //   {a:'Math is easy...',b:'when you add a little confidence!'},
// // //   {a:'Great job!',b:'Your brain is on fire!'},
// // //   {a:'Smart move...',b:'you are getting sharper!'},
// // //   {a:'Nice one!',b:'Keep that streak going!'},
// // //   {a:'Wow...',b:'that was a tricky one!'}];

// // // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// // //   const cheer=CHEERS[(n-1)%CHEERS.length];
// // //   const pop=useRef(new Animated.Value(0)).current,bub=useRef(new Animated.Value(0)).current,btn=useRef(new Animated.Value(0)).current,
// // //     bounce=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,wig=useRef(new Animated.Value(0)).current;
// // //   useEffect(()=>{
// // //     Animated.sequence([
// // //       Animated.spring(pop,{toValue:1,friction:4,tension:80,useNativeDriver:true}),
// // //       Animated.spring(bub,{toValue:1,friction:5,tension:70,useNativeDriver:true}),
// // //       Animated.spring(btn,{toValue:1,friction:5,tension:70,useNativeDriver:true})]).start();
// // //     const loop=(v:Animated.Value,d:number)=>Animated.loop(Animated.sequence([Animated.timing(v,{toValue:1,duration:d,useNativeDriver:true}),Animated.timing(v,{toValue:0,duration:d,useNativeDriver:true})])).start();
// // //     loop(bounce,650);loop(tw,700);loop(pulse,800);loop(wig,900);
// // //   },[]);
// // //   const popS=pop.interpolate({inputRange:[0,1],outputRange:[0.2,1]});
// // //   const bubS=bub.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
// // //   const btnS=btn.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
// // //   const pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.07]});
// // //   const twO=tw.interpolate({inputRange:[0,1],outputRange:[0.25,1]});
// // //   const twS=tw.interpolate({inputRange:[0,1],outputRange:[0.85,1.12]});
// // //   const wigR=wig.interpolate({inputRange:[0,1],outputRange:['-12deg','12deg']});
// // //   const bY=bounce.interpolate({inputRange:[0,1],outputRange:[0,-14]});
// // //   const bR=bounce.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
// // //   return <View style={wn.wood}>
// // //     {/* paper */}
// // //     <View style={wn.paper}>
// // //       <View style={wn.holes}>{Array.from({length:11},(_,i)=><View key={i} style={wn.hole}/>)}</View>
// // //       {Array.from({length:20},(_,i)=><View key={i} style={[wn.ln,{top:84+i*36}]}/>)}

// // //       {/* top bar */}
// // //       <View style={wn.head}>
// // //         <TouchableOpacity onPress={onHome} style={wn.round}><Icon n="home" s={20}/></TouchableOpacity>
// // //         <TouchableOpacity style={wn.round}><Icon n="gear" s={20}/></TouchableOpacity>
// // //         <TouchableOpacity style={wn.round}><Icon n="dots" s={20}/></TouchableOpacity>
// // //         <View style={wn.lvlWrap}>
// // //           <View style={wn.dashes}><View style={[wn.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[wn.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // //           <View style={wn.lvl}><Text style={wn.lvlt}>{'LEVEL '+n}</Text></View>
// // //           <View style={wn.dashes}><View style={[wn.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[wn.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // //         </View>
// // //         <View style={wn.pill}><Text style={wn.pn}>{hints}</Text><Icon n="bulb" s={22}/></View>
// // //       </View>

// // //       <View style={wn.body}>
// // //         {/* big message */}
// // //         <Animated.View style={[wn.msgWrap,{opacity:pop,transform:[{scale:popS}]}]}>
// // //           <Animated.View style={{opacity:twO,transform:[{rotate:'-20deg'}]}}><View style={wn.spark}/></Animated.View>
// // //           <Text style={wn.msg} numberOfLines={2} adjustsFontSizeToFit>{msg}</Text>
// // //           <Animated.View style={{opacity:twO,transform:[{rotate:'20deg'}]}}><View style={wn.spark}/></Animated.View>
// // //         </Animated.View>

// // //         {/* speech bubble */}
// // //         <Animated.View style={{alignItems:'center',opacity:bub,transform:[{scale:bubS}]}}>
// // //           <View style={wn.bubble}>
// // //             <Text style={wn.b1}>{cheer.a}</Text>
// // //             <Text style={wn.b2}>{cheer.b}</Text>
// // //             <View style={{position:'absolute',right:16,top:16}}><Smiley w={26}/></View>
// // //           </View>
// // //           <View style={{marginTop:-3,alignSelf:'flex-end',marginRight:70}}>
// // //             <Svg width={34} height={26} viewBox="0 0 34 26"><Polygon points="0,0 34,0 8,26" fill="#fff3a0"/><Path d="M0 0 L8 26 L34 0" stroke={INK} strokeWidth="2" fill="none" strokeDasharray="5 3"/></Svg>
// // //           </View>
// // //         </Animated.View>

// // //         {/* brain hero */}
// // //         <View style={{alignItems:'center',justifyContent:'center'}}>
// // //           <Animated.View style={{position:'absolute',opacity:twO,transform:[{scale:twS}]}}><Rays w={270}/></Animated.View>
// // //           <Animated.View style={{opacity:pop,transform:[{translateY:bY},{rotate:bR},{scale:popS}]}}><BrainHero w={210}/></Animated.View>
// // //           <Animated.View style={{position:'absolute',left:-6,top:30,opacity:pop,transform:[{rotate:wigR}]}}><StarDoodle w={44}/></Animated.View>
// // //           <Animated.View style={{position:'absolute',right:-10,top:120,opacity:pop,transform:[{rotate:wigR}]}}><StarDoodle w={40}/></Animated.View>
// // //         </View>

// // //         {/* DONE button */}
// // //         <Animated.View style={{opacity:btn,transform:[{scale:btnS}]}}>
// // //           <Animated.View style={{transform:[{scale:pulseS}]}}>
// // //             <TouchableOpacity activeOpacity={0.85} onPress={onNext} style={wn.btn}>
// // //               <View style={wn.btnShine}/>
// // //               <Text style={wn.btnt}>{hasNext?'NEXT':'DONE'}</Text>
// // //               <Svg width={34} height={34} viewBox="0 0 24 24" style={{marginLeft:8}}>
// // //                 <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
// // //                 <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
// // //               </Svg>
// // //             </TouchableOpacity>
// // //           </Animated.View>
// // //         </Animated.View>
// // //       </View>
// // //     </View>

// // //     {/* sticky note (top right) */}
// // //     <View pointerEvents="none" style={wn.sticky}><Smiley w={34}/></View>

// // //     {/* books (bottom left) */}
// // //     <View pointerEvents="none" style={wn.books}>
// // //       {[['Think','#9b4fc0',130],['Learn','#2f7fd0',118],['Grow','#f0a830',124]].map(([t,c,w]:any,i)=>
// // //         <View key={t} style={[wn.book,{backgroundColor:c,width:w,marginLeft:i===1?10:i===2?-4:0}]}><Text style={wn.bookt}>{t+' ♥'}</Text></View>)}
// // //     </View>

// // //     {/* pencil cup (bottom right) */}
// // //     <View pointerEvents="none" style={wn.cup}>
// // //       <View style={[wn.pen,{backgroundColor:'#ee6aa0',left:8,height:34,transform:[{rotate:'-12deg'}]}]}/>
// // //       <View style={[wn.pen,{backgroundColor:'#f6c928',left:22,height:44}]}/>
// // //       <View style={[wn.pen,{backgroundColor:'#2aa7b0',left:36,height:38,transform:[{rotate:'12deg'}]}]}/>
// // //       <View style={wn.cupBody}><Smiley w={26}/></View>
// // //     </View>

// // //     <Confetti/>
// // //   </View>}

// // // function Level({n,player,hints,setHints,onWin,onHome}:any){
// // //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// // //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// // //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// // //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// // //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// // //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// // //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// // //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// // //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// // //   // choice level: tap an item (answer = item index)
// // //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// // //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// // //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// // //   // choice level with number options (answer = the number)
// // //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// // //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// // //   // levels with a counter (- / +) or a keypad: send the typed number
// // //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// // //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// // //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// // //   // old tap-the-cloud level (kept so old data still works)
// // //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// // //   // multi-drag levels: every item with drag:true is dragged on its own
// // //   //  mode 'combine' -> drop one item on another; sends {from,to} (smaller index first)
// // //   //  mode 'away'    -> each one must be dragged away
// // //   //  mode 'feed'    -> each one must be dropped on item lv.target
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
// // //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>onWin(r),1500)}
// // //         else{flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// // //         return}
// // //       let ok=false;
// // //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// // //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// // //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// // //       goneR.current=[...goneR.current,i];
// // //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// // //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// // //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// // //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>onWin(r),l.mode==='away'?2200:900)}}
// // //     }}))).current;
// // //   // drag level: item 0 is dragged onto item lv.target (default 1)
// // //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// // //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// // //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// // //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// // //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// // //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// // //         setOpen(true);
// // //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// // //         setTimeout(()=>onWin(r),1100);return}}
// // //       else if(hit)flash('Open the fridge first!');
// // //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// // //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// // //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// // //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// // //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// // //   const board=lv?.bg==='board';

// // //   const stage=lv&&<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// // //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// // //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// // //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// // //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// // //         // multi-drag levels (combine numbers / clouds away / both cookies to the cat)
// // //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// // //         // tap-an-item levels only (NOT the counter / keypad levels)
// // //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// // //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// // //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// // //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// // //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// // //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
// // //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// // //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// // //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// // //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// // //     </View>;

// // //   // ---------- chalkboard layout (same look as the reference design) ----------
// // //   if(board)return <View style={bd.wall}>
// // //     <View style={bd.frame}><View style={bd.board}>
// // //       {/* chalk dust smudges */}
// // //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// // //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// // //       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>

// // //       {/* top bar: home + gear | hanging LEVEL sign | bulb counter */}
// // //       <View style={bd.top}>
// // //         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
// // //         <View style={bd.signWrap}>
// // //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// // //           <View style={bd.sign}>
// // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// // //             <Text style={bd.signt}>{'LEVEL '+n}</Text>
// // //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// // //           </View>
// // //         </View>
// // //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// // //       </View>

// // //       <Text style={bd.q}>{lv.question}</Text>

// // //       <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240}}>{stage}</View>

// // //       {/* eraser + pencil decoration */}
// // //       <View pointerEvents="box-none" style={bd.decor}>
// // //         <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
// // //         <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
// // //       </View>

// // //       {/* hint / video / skip buttons */}
// // //       <View style={bd.actions}>
// // //         <TouchableOpacity onPress={hint} activeOpacity={0.85} style={bd.hintBtn}><Icon n="search" s={34}/></TouchableOpacity>
// // //         <TouchableOpacity onPress={()=>reward('video')} activeOpacity={0.85} style={bd.videoBtn}>
// // //           <Icon n="film" s={40}/>
// // //           <View style={bd.vlabel}><Coin s={12}/><Text style={bd.vlt}>+75</Text></View>
// // //         </TouchableOpacity>
// // //         <TouchableOpacity onPress={skip} activeOpacity={0.85} style={bd.skipBtn}><Icon n="play" s={36}/></TouchableOpacity>
// // //       </View>

// // //       {/* wooden ledge with duster + chalk */}
// // //       <View style={bd.ledge}>
// // //         {(lv.items||[]).filter((it:any)=>it.k==='duster').map((it:any,i:number)=><View key={'d'+i} style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>)}
// // //         {(lv.items||[]).filter((it:any)=>it.k==='chalk').map((it:any,i:number)=><View key={'c'+i} style={{position:'absolute',left:'38%',bottom:20}}><Chalk w={90}/></View>)}
// // //       </View>
// // //       {!!note&&<Text style={bd.note}>{note}</Text>}
// // //     </View></View>
// // //     <View style={bd.wallBottom}/>
// // //   </View>;

// // //   // ---------- notebook layout (other levels) ----------
// // //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// // //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// // //     {stage}
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
// // //     </>}
// // //     {!!note&&<Text style={st.note}>{note}</Text>}
// // //   </Paper>}

// // // export default function BrainTwistFlow({onExit}:any){
// // //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// // //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||1))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// // //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// // //   if(scr==='ready')return <Ready hints={hints} onHome={onExit} err={err} onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;
// // //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// // //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // // /* ---------- WIN screen styles ---------- */
// // // const wn=StyleSheet.create({
// // //   wood:{flex:1,backgroundColor:'#c98a4e',paddingTop:30,paddingHorizontal:12,paddingBottom:44,overflow:'hidden'},
// // //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:6,shadowOffset:{width:0,height:3}},
// // //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},
// // //   hole:{width:16,height:22,borderRadius:8,backgroundColor:'#c98a4e'},
// // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#dbe9ee'},
// // //   head:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,marginTop:12,paddingHorizontal:6},
// // //   round:{width:38,height:38,borderRadius:19,backgroundColor:'#ffd21f',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
// // //   lvlWrap:{flexDirection:'row',alignItems:'center',gap:3,marginHorizontal:4},
// // //   lvl:{backgroundColor:'#ffe45c',paddingHorizontal:8,paddingVertical:3,borderRadius:4,transform:[{rotate:'-2deg'}]},
// // //   lvlt:{fontFamily:F,fontSize:18,fontWeight:'900',color:INK},
// // //   dashes:{gap:3,justifyContent:'center'},dash:{width:8,height:3,borderRadius:2,backgroundColor:INK},
// // //   pill:{flexDirection:'row',alignItems:'center',gap:3,borderWidth:2.5,borderColor:INK,borderRadius:18,paddingHorizontal:10,backgroundColor:'#fff',height:34},
// // //   pn:{fontFamily:F,fontSize:18,fontWeight:'900',color:INK},
// // //   body:{flex:1,alignItems:'center',justifyContent:'space-around',paddingVertical:10,paddingHorizontal:10},
// // //   msgWrap:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,width:'100%'},
// // //   msg:{fontFamily:F,fontSize:46,fontWeight:'900',color:'#14213d',textAlign:'center',flexShrink:1},
// // //   spark:{width:22,height:5,borderRadius:3,backgroundColor:'#ffd21f'},
// // //   bubble:{backgroundColor:'#fff3a0',borderWidth:2.5,borderColor:INK,borderStyle:'dashed',borderRadius:38,paddingHorizontal:26,paddingVertical:16,maxWidth:310},
// // //   b1:{fontFamily:F,fontSize:22,fontWeight:'900',color:INK},
// // //   b2:{fontFamily:F,fontSize:22,fontWeight:'900',color:'#8e2fa8'},
// // //   btn:{minWidth:250,height:66,borderRadius:33,backgroundColor:'#7fd83a',borderWidth:4,borderColor:INK,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:30,overflow:'hidden'},
// // //   btnShine:{position:'absolute',top:3,left:18,right:18,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.4)'},
// // //   btnt:{fontFamily:F,fontSize:34,fontWeight:'900',color:INK},
// // //   sticky:{position:'absolute',top:18,right:-4,width:62,height:62,backgroundColor:'#ffe36b',alignItems:'center',justifyContent:'center',transform:[{rotate:'8deg'}],elevation:8,shadowColor:'#000',shadowOpacity:0.2,shadowRadius:3,shadowOffset:{width:0,height:2}},
// // //   books:{position:'absolute',left:4,bottom:6},
// // //   book:{height:30,borderRadius:4,justifyContent:'center',paddingHorizontal:14,marginTop:1,borderBottomWidth:3,borderBottomColor:'rgba(0,0,0,0.25)'},
// // //   bookt:{fontFamily:F,fontSize:14,fontWeight:'900',color:'#fff'},
// // //   cup:{position:'absolute',right:16,bottom:4,width:66,height:90},
// // //   pen:{position:'absolute',top:0,width:10,borderRadius:3,borderTopLeftRadius:5,borderTopRightRadius:5},
// // //   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:52,backgroundColor:'#2f7fd0',borderRadius:6,borderWidth:2.5,borderColor:'#1d5aa0',alignItems:'center',justifyContent:'center'}});

// // // /* ---------- chalkboard level styles ---------- */
// // // const bd=StyleSheet.create({
// // //   wall:{flex:1,backgroundColor:'#f1dcc0'},
// // //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:6,backgroundColor:'#1f5b44',overflow:'hidden'},
// // //   board:{flex:1,alignItems:'center'},
// // //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
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
// // //   q:{fontFamily:F,fontSize:23,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// // //   decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
// // //   actions:{position:'absolute',left:0,right:0,bottom:84,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:34},
// // //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// // //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // //   vlabel:{position:'absolute',bottom:-14,right:-14,flexDirection:'row',alignItems:'center',gap:2},
// // //   vlt:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// // //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// // //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
// // //   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// // //   wallBottom:{height:18},
// // //   wbtn:{width:36,height:36,borderRadius:18,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',alignItems:'center',justifyContent:'center'},
// // //   pill:{flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#8b5a2b',borderWidth:3,borderColor:'#5b3a18',borderRadius:18,paddingHorizontal:7,height:34},
// // //   pillt:{fontFamily:F,fontSize:16,fontWeight:'bold',color:CREAM,minWidth:14,textAlign:'center'},
// // //   plus:{width:20,height:20,borderRadius:10,backgroundColor:'#3f9a2f',alignItems:'center',justifyContent:'center'},plust:{color:'#fff',fontWeight:'bold',fontSize:15,lineHeight:18}});

// // // /* ---------- READY screen styles ---------- */
// // // const rd=StyleSheet.create({
// // //   wrap:{flex:1,backgroundColor:'#2e5a47',paddingTop:34},
// // //   top:{flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:8},
// // //   card:{flex:1,marginHorizontal:16,marginTop:26,marginBottom:110,backgroundColor:'#f6ecd6',borderRadius:6,alignItems:'center',overflow:'hidden'},
// // //   holes:{position:'absolute',top:2,left:0,right:0,flexDirection:'row',justifyContent:'space-around'},hole:{width:14,height:20,borderRadius:7,backgroundColor:'#2e5a47'},
// // //   title:{fontFamily:F,fontSize:28,fontWeight:'bold',textAlign:'center',color:INK,marginTop:14},
// // //   uline:{width:200,height:4,borderRadius:2,backgroundColor:'#f5b82e',marginTop:6,marginBottom:34},
// // //   btnOuter:{backgroundColor:'#7a4a22',borderRadius:34,padding:5},
// // //   btnIn:{backgroundColor:'#3f9a2f',borderRadius:30,paddingHorizontal:40,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:10},
// // //   btnt:{fontFamily:F,fontSize:34,fontWeight:'bold',color:'#fff'},
// // //   desk:{position:'absolute',left:0,right:0,bottom:0,height:100,backgroundColor:'#a86f35',borderTopWidth:4,borderTopColor:'#8a5a2b'},
// // //   book:{height:30,borderRadius:3,justifyContent:'center',paddingHorizontal:18,marginTop:2},bookt:{fontFamily:F,fontSize:12,fontWeight:'bold',color:'#f3e6c8'}});

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
// // //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
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
// // //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// // //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// // //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// // //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// // import React,{useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,Easing,PanResponder,StyleSheet,Dimensions,Platform} from 'react-native';
// // import Svg,{Rect,Path,Circle,Polygon,Line,G,Ellipse} from 'react-native-svg';
// // import * as api from './api';
// // import {Lion,Elephant,Mouse,Zebra,Sloth,Cloud,Flower,Fridge,CloudPair,Moon,Sun,Pizza,Racer,Cookie,Barrier,Cat,Drop,Brain,Icon} from './Art';
// // import {PointerHand} from './CelebrationHands';

// // const F:any=Platform.select({ios:'Chalkboard SE',android:'sans-serif-condensed',default:'sans-serif'});
// // const INK='#1b1b1b',GREEN='#c5f158',W=Dimensions.get('window').width,CREAM='#f6efe0',CHALK='#f6f4ea';

// // /* ---------- chalkboard level art (drawn here, no change in Art.tsx) ---------- */
// // // big white chalk number (no circle)
// // const Num=({w,t}:any)=><View style={{width:w,height:w,alignItems:'center',justifyContent:'center'}}>
// //   <Text style={{fontFamily:F,fontSize:w*0.95,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{t}</Text></View>;
// // const Duster=({w}:any)=><Svg width={w} height={w*0.5} viewBox="0 0 100 50"><Rect x="3" y="3" width="94" height="20" rx="3" fill="#b9854a"/><Rect x="3" y="3" width="94" height="6" rx="3" fill="#d09a5c"/><Rect x="3" y="23" width="94" height="24" rx="3" fill="#3b3b3d"/><Path d="M8 31 H92 M8 39 H92" stroke="#58585b" strokeWidth="2"/></Svg>;
// // const Chalk=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 100 20"><Rect x="3" y="3" width="94" height="14" rx="5" fill="#f1efe6"/><Rect x="3" y="3" width="94" height="5" rx="2.5" fill="#fffdf6"/></Svg>;
// // // blue eraser (decoration on the board)
// // const Eraser=({w}:any)=><Svg width={w} height={w*0.62} viewBox="0 0 100 62"><Rect x="4" y="8" width="92" height="46" rx="12" fill="#f4f4f0" stroke="#d9d9d4" strokeWidth="2"/><Path d="M4 20 Q4 8 16 8 H70 L52 54 H16 Q4 54 4 42 Z" fill="#2ab4d9"/><Path d="M12 15 H60" stroke="#8fe0f2" strokeWidth="3" strokeLinecap="round"/></Svg>;
// // // green pencil (decoration on the board)
// // const Pencil=({w}:any)=><Svg width={w} height={w*0.2} viewBox="0 0 150 30"><Polygon points="2,15 26,4 26,26" fill="#f1c58a" stroke="#c9985a" strokeWidth="1"/><Polygon points="2,15 10,11.5 10,18.5" fill="#333"/><Rect x="26" y="4" width="84" height="22" fill="#2fa86f"/><Line x1="28" y1="11" x2="108" y2="11" stroke="#8de0b8" strokeWidth="2"/><Line x1="28" y1="19" x2="108" y2="19" stroke="#1f7a4e" strokeWidth="2"/><Rect x="110" y="3" width="26" height="24" fill="#9a9a9a"/><Line x1="116" y1="3" x2="116" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Line x1="124" y1="3" x2="124" y2="27" stroke="#6f6f6f" strokeWidth="2"/><Rect x="136" y="6" width="12" height="18" rx="6" fill="#f4f2ea"/></Svg>;

// // // free drag: the item moves with the finger and stays where it is dropped
// // function FreeDrag({children}:any){
// //   const pan=useRef(new Animated.ValueXY()).current;
// //   const pr=useRef(PanResponder.create({
// //     onStartShouldSetPanResponder:()=>true,
// //     onPanResponderGrant:()=>{pan.extractOffset()},
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:()=>{pan.flattenOffset()}})).current;
// //   return <Animated.View {...pr.panHandlers} style={{transform:pan.getTranslateTransform()}}>{children}</Animated.View>}

// // const ART:any={lion:Lion,elephant:Elephant,mouse:Mouse,zebra:Zebra,sloth:Sloth,cloud:Cloud,flower:Flower,fridge:Fridge,cloudpair:CloudPair,moon:Moon,sun:Sun,pizza:Pizza,racer:Racer,cookie:Cookie,barrier:Barrier,cat:Cat,num:Num,duster:Duster,chalk:Chalk};

// // /* ---------- shared bits ---------- */
// // const WIcon=({n}:any)=><Svg width={22} height={22} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#fff"/>
// //   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2.6" fill="none"/></G>
// //   :<G><Circle cx="5" cy="12" r="2" fill="#fff"/><Circle cx="12" cy="12" r="2" fill="#fff"/><Circle cx="19" cy="12" r="2" fill="#fff"/></G>}</Svg>;
// // const Coin=({s=18}:any)=><View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#f5c518',borderWidth:2,borderColor:'#c9970c'}}/>;

// // /* ---------- READY screen art (drawn here) ---------- */
// // // winking brain mascot with glasses, pointing finger
// // const BrainMascot=({w}:any)=><Svg width={w} height={w*0.85} viewBox="0 0 200 170">
// //   <Path d="M118 142 Q140 152 152 132" stroke="#1c2b4a" strokeWidth="7" fill="none" strokeLinecap="round"/>
// //   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
// //     <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
// //   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
// //     <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
// //   <Path d="M78 48 Q90 58 82 70 M120 46 Q110 58 120 68 M58 88 Q70 94 64 106 M144 88 Q132 96 138 108" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
// //   {/* glasses */}
// //   <Line x1="60" y1="90" x2="42" y2="86" stroke="#1c2b4a" strokeWidth="5" strokeLinecap="round"/>
// //   <Circle cx="78" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
// //   <Circle cx="124" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
// //   <Path d="M97 90 Q101 86 105 90" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
// //   {/* open eye + wink */}
// //   <Circle cx="80" cy="93" r="12" fill="#fff"/><Circle cx="82" cy="94" r="7.5" fill="#1c2b4a"/><Circle cx="84" cy="91" r="2.6" fill="#fff"/>
// //   <Path d="M113 95 Q124 82 135 95" stroke="#1c2b4a" strokeWidth="5" fill="none" strokeLinecap="round"/>
// //   <Circle cx="64" cy="112" r="7" fill="#ff7a96" opacity="0.7"/><Circle cx="140" cy="112" r="7" fill="#ff7a96" opacity="0.7"/>
// //   {/* mouth */}
// //   <Path d="M88 116 Q101 136 114 116 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
// //   <Path d="M94 125 Q101 132 108 125 Q101 121 94 125Z" fill="#ff8aa0"/>
// //   {/* pointing hand */}
// //   <Circle cx="152" cy="132" r="14" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// //   <Rect x="146" y="106" width="11" height="30" rx="5.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3" transform="rotate(-12 151 121)"/>
// // </Svg>;

// // const BulbDoodle=({w,smile}:any)=><Svg width={w} height={w} viewBox="0 0 50 50">
// //   <Path d="M25 8 C15 8 11 16 14 23 C16 27 18 29 18 33 H32 C32 29 34 27 36 23 C39 16 35 8 25 8Z" stroke="#a79ee0" strokeWidth="1.8" fill="none"/>
// //   <Path d="M19 37 H31 M21 41 H29" stroke="#a79ee0" strokeWidth="1.8" strokeLinecap="round"/>
// //   <Path d="M25 2V4 M8 10 L10 12 M42 10 L40 12 M3 24 H6 M44 24 H47" stroke="#a79ee0" strokeWidth="1.6" strokeLinecap="round"/>
// //   {smile&&<><Circle cx="21" cy="20" r="1.2" fill="#a79ee0"/><Circle cx="29" cy="20" r="1.2" fill="#a79ee0"/><Path d="M20 25 Q25 29 30 25" stroke="#a79ee0" strokeWidth="1.5" fill="none"/></>}</Svg>;

// // const TinyStar=({w}:any)=><Svg width={w} height={w} viewBox="0 0 50 50"><Polygon points="25,6 31,19 45,20 34,30 38,44 25,36 12,44 16,30 5,20 19,19" stroke="#b9b1ea" strokeWidth="2" fill="none" strokeLinejoin="round"/></Svg>;

// // const Smiley=({w,c=INK}:any)=><Svg width={w} height={w} viewBox="0 0 40 40"><Circle cx="14" cy="15" r="2" fill={c}/><Circle cx="26" cy="15" r="2" fill={c}/><Path d="M10 24 Q20 34 30 24" stroke={c} strokeWidth="2.6" fill="none" strokeLinecap="round"/></Svg>;

// // const BookIcon=({k}:any)=><Svg width={26} height={26} viewBox="0 0 24 24">{k==='brain'?<G><Circle cx="9" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Circle cx="15" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M12 6 V19" stroke="#fff" strokeWidth="1.8"/></G>
// //   :k==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="3.6" strokeDasharray="2.8 3.2" fill="none"/><Circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2" fill="none"/></G>
// //   :<G><Path d="M12 3 C7 3 5 8 7 11 C8.5 13 9 14 9 16 H15 C15 14 15.5 13 17 11 C19 8 17 3 12 3Z" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M9.5 19 H14.5 M10.5 21.5 H13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></G>}</Svg>;

// // /* ---------- READY screen ---------- */
// // function Ready({hints,n,onHome,onGo,err}:any){
// //   const enter=useRef(new Animated.Value(0)).current,brainIn=useRef(new Animated.Value(0)).current,
// //     fl=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current,
// //     pu=useRef(new Animated.Value(0)).current,gl=useRef(new Animated.Value(0)).current;
// //   useEffect(()=>{
// //     Animated.sequence([
// //       Animated.spring(enter,{toValue:1,friction:6,tension:60,useNativeDriver:true}),
// //       Animated.spring(brainIn,{toValue:1,friction:4,tension:80,useNativeDriver:true})]).start();
// //     const loop=(v:Animated.Value,d:number)=>Animated.loop(Animated.sequence([Animated.timing(v,{toValue:1,duration:d,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),Animated.timing(v,{toValue:0,duration:d,easing:Easing.inOut(Easing.quad),useNativeDriver:true})])).start();
// //     loop(fl,1100);loop(tw,700);loop(pu,800);loop(gl,1800);
// //   },[]);
// //   const nbY=enter.interpolate({inputRange:[0,1],outputRange:[80,0]});
// //   const flY=fl.interpolate({inputRange:[0,1],outputRange:[0,-9]});
// //   const flR=fl.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
// //   const brS=brainIn.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
// //   const twO=tw.interpolate({inputRange:[0,1],outputRange:[0.25,1]});
// //   const puS=pu.interpolate({inputRange:[0,1],outputRange:[1,1.06]});
// //   const glO=gl.interpolate({inputRange:[0,1],outputRange:[0.1,0.26]});
// //   const spark=(style:any,rot:string)=><Animated.View pointerEvents="none" style={[{position:'absolute',width:20,height:5,borderRadius:3,backgroundColor:'#ffd21f',opacity:twO,transform:[{rotate:rot}]},style]}/>;
// //   return <View style={rd.wrap}>
// //     {/* ---- room ---- */}
// //     <View pointerEvents="none" style={rd.window}><View style={rd.winV}/><View style={rd.winH}/><View style={[rd.winH,{top:'72%'}]}/></View>
// //     <View pointerEvents="none" style={rd.shelf}>{[['#3b2a8a',26],['#2a5a9a',20],['#7a3a8a',24],['#2a4a8a',18],['#5a3a9a',22],['#2a6a8a',20]].map(([c,w]:any,i)=><View key={i} style={{width:w,height:46+(i%3)*10,backgroundColor:c,marginRight:3,borderTopLeftRadius:3,borderTopRightRadius:3}}/>)}</View>
// //     <View pointerEvents="none" style={rd.lamp}>
// //       <View style={{width:2,height:46,backgroundColor:'#2a2260'}}/>
// //       <Svg width={74} height={34} viewBox="0 0 74 34"><Path d="M8 34 Q8 6 37 6 Q66 6 66 34 Z" fill="#4a2fa0"/><Path d="M14 30 Q14 12 37 12" stroke="#7a5cf0" strokeWidth="3" fill="none"/></Svg>
// //       <Animated.View style={{position:'absolute',top:56,left:-24,width:122,height:122,borderRadius:61,backgroundColor:'#ffb84a',opacity:glO}}/>
// //     </View>
// //     <View pointerEvents="none" style={rd.plant}>
// //       <Svg width={90} height={150} viewBox="0 0 90 150">
// //         <Path d="M10 150 Q8 110 20 90" stroke="#1f6a2e" strokeWidth="4" fill="none"/>
// //         <Ellipse cx="22" cy="86" rx="12" ry="26" fill="#2fa43f" transform="rotate(20 22 86)"/>
// //         <Ellipse cx="40" cy="104" rx="11" ry="24" fill="#3fbf4e" transform="rotate(60 40 104)"/>
// //         <Ellipse cx="12" cy="112" rx="10" ry="22" fill="#27903a" transform="rotate(-25 12 112)"/>
// //         <Ellipse cx="34" cy="70" rx="9" ry="20" fill="#3fbf4e" transform="rotate(40 34 70)"/>
// //       </Svg>
// //     </View>

// //     {/* ---- top bar ---- */}
// //     <View style={rd.top}>
// //       <TouchableOpacity onPress={onHome} style={[rd.tb,{borderColor:'#3aa6ff'}]}><WIcon n="home"/></TouchableOpacity>
// //       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="gear"/></TouchableOpacity>
// //       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="dots"/></TouchableOpacity>
// //       <View style={{flex:1}}/>
// //       <View style={rd.cpill}><Coin s={26}/><Text style={rd.cnum}>{hints}</Text><View style={rd.cplus}><Text style={rd.cplust}>+</Text></View></View>
// //     </View>

// //     {/* ---- notebook ---- */}
// //     <Animated.View style={[rd.nb,{opacity:enter,transform:[{translateY:nbY}]}]}>
// //       <View style={rd.nbIn}>
// //         {Array.from({length:14},(_,i)=><View key={i} style={[rd.ln,{top:90+i*34}]}/>)}
// //         {/* scribbles */}
// //         <View style={{position:'absolute',left:14,top:84}}><BulbDoodle w={44}/></View>
// //         <View style={{position:'absolute',left:10,top:190}}><TinyStar w={22}/></View>
// //         <View style={{position:'absolute',right:16,top:150}}><TinyStar w={22}/></View>
// //         <View style={{position:'absolute',left:30,top:300}}><TinyStar w={22}/></View>
// //         <View style={{position:'absolute',right:16,bottom:14}}><BulbDoodle w={52} smile/></View>
// //         <Text style={rd.tsg}>{'Think\nSolve\nGrow ♡'}</Text>

// //         <View style={rd.content}>
// //           <View style={rd.qBlob}><Text style={rd.q}>{'ARE YOU READY TO\nTEST YOUR BRAIN?'}</Text></View>
// //           <Svg width={230} height={14} viewBox="0 0 230 14" style={{marginTop:4}}><Path d="M4 10 Q60 2 118 7 Q170 11 226 4" stroke="#f5c518" strokeWidth="4.5" fill="none" strokeLinecap="round"/></Svg>

// //           <Animated.View style={{marginTop:44,transform:[{scale:puS}]}}>
// //             <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
// //               <View style={rd.btnShine}/>
// //               <Svg width={32} height={32} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg>
// //               <Text style={rd.btnt}>READY</Text>
// //             </View></TouchableOpacity>
// //             {spark({right:-26,top:8},'-35deg')}{spark({right:-30,top:28},'0deg')}{spark({right:-24,top:48},'35deg')}
// //           </Animated.View>
// //           {!!err&&<Text style={rd.err}>{err}</Text>}
// //         </View>
// //       </View>

// //       {/* spiral rings */}
// //       <View pointerEvents="none" style={rd.rings}>{Array.from({length:9},(_,i)=><View key={i} style={rd.ring}/>)}</View>

// //       {/* LEVEL tag */}
// //       <Animated.View pointerEvents="none" style={[rd.lvTag,{opacity:brainIn,transform:[{rotate:'-2deg'},{scale:brS}]}]}>
// //         <Text style={rd.lvt}>{'LEVEL '}<Text style={{color:'#ffd21f'}}>{n}</Text></Text></Animated.View>
// //       {spark({right:6,top:22},'-30deg')}{spark({right:2,top:44},'25deg')}

// //       {/* brain mascot */}
// //       <Animated.View pointerEvents="none" style={[rd.mascot,{transform:[{translateY:flY},{rotate:flR},{scale:brS}]}]}>
// //         <BrainMascot w={170}/>
// //       </Animated.View>
// //       {spark({left:150,top:-60},'60deg')}{spark({left:160,top:-40},'20deg')}{spark({left:130,top:6},'-50deg')}
// //     </Animated.View>

// //     {/* ---- desk ---- */}
// //     <View pointerEvents="none" style={rd.desk}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:24+i*24,height:2,backgroundColor:'rgba(70,30,5,0.18)'}}/>)}</View>

// //     {/* books */}
// //     <View pointerEvents="none" style={rd.books}>
// //       {[['Unlock','#7a3fd0',200,'brain',0],['Solve','#2f6fd8',196,'gear',6],['Think','#f0a020',206,'bulb',-4]].map(([t,c,w,k,ml]:any)=>
// //         <View key={t} style={[rd.book,{backgroundColor:c,width:w,marginLeft:ml}]}>
// //           <View style={rd.bookIc}><BookIcon k={k}/></View>
// //           <Text style={rd.bookt}>{t}</Text>
// //           <View style={rd.bookPg}/>
// //         </View>)}
// //     </View>

// //     {/* pencil cup */}
// //     <View pointerEvents="none" style={rd.cup}>
// //       <View style={[rd.pen,{backgroundColor:'#3a8be0',left:12,height:64,transform:[{rotate:'-16deg'}]}]}/>
// //       <View style={[rd.pen,{backgroundColor:'#f6b928',left:32,height:74,transform:[{rotate:'-4deg'}]}]}/>
// //       <View style={[rd.pen,{backgroundColor:'#ee5a8a',left:52,height:80,transform:[{rotate:'10deg'}]}]}/>
// //       <View style={rd.cupBody}><Smiley w={44} c="#1c2350"/></View>
// //     </View>
// //   </View>}

// // /* ---------- old notebook paper (splash / other levels) ---------- */
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

// // const COL=['#ff6b6b','#ffd84d','#7ee8fa','#c5f158','#d6a8ff'];
// // function Confetti(){const p=useRef(Array.from({length:40},(_,i)=>({y:new Animated.Value(-30),x:Math.random()*(W-40),c:COL[i%5],d:2000+Math.random()*1800,r:Math.random()*360}))).current;
// //   useEffect(()=>{p.forEach(o=>Animated.timing(o.y,{toValue:950,duration:o.d,useNativeDriver:true}).start())},[]);
// //   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{p.map((o,i)=><Animated.View key={i} style={{position:'absolute',left:o.x,width:12,height:18,backgroundColor:o.c,transform:[{translateY:o.y},{rotate:o.y.interpolate({inputRange:[-30,950],outputRange:[o.r+'deg',(o.r+720)+'deg']})}]}}/>)}</View>}

// // function Splash({onDone}:any){const[p,setP]=useState(0);
// //   useEffect(()=>{const t=setInterval(()=>setP(x=>Math.min(100,x+2)),45);return()=>clearInterval(t)},[]);
// //   useEffect(()=>{if(p>=100){const t=setTimeout(onDone,300);return()=>clearTimeout(t)}},[p]);
// //   return <View style={st.splash}><View style={{alignItems:'center',justifyContent:'center'}}><Brain w={210} p={p}/><Text style={st.pct}>{p}%</Text></View></View>}

// // /* ---------- WIN screen art (drawn here, animated) ---------- */
// // // cartoon brain with glasses, thumbs up and blue shoes
// // const BrainHero=({w}:any)=><Svg width={w} height={w*0.95} viewBox="0 0 200 190">
// //   <Ellipse cx="100" cy="184" rx="62" ry="6" fill="#d9cdf0"/>
// //   <Line x1="86" y1="148" x2="84" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
// //   <Line x1="114" y1="148" x2="116" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
// //   <Ellipse cx="80" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
// //   <Ellipse cx="120" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
// //   <Path d="M70 174 H90 M110 174 H130" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
// //   <Path d="M52 112 Q36 106 30 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
// //   <Path d="M148 112 Q164 106 170 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
// //   <Rect x="16" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// //   <Rect x="22" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// //   <Rect x="158" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// //   <Rect x="169" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// //   {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
// //     <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
// //   {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
// //     <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
// //   <Path d="M78 52 Q90 62 82 74 M120 50 Q110 62 120 72 M58 92 Q70 98 64 110 M144 92 Q132 100 138 112" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
// //   <Circle cx="62" cy="116" r="8" fill="#ff7a96" opacity="0.7"/><Circle cx="138" cy="116" r="8" fill="#ff7a96" opacity="0.7"/>
// //   <Circle cx="80" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
// //   <Circle cx="120" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
// //   <Path d="M99 96 Q100 92 101 96" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
// //   <Path d="M70 100 Q80 88 90 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
// //   <Path d="M110 100 Q120 88 130 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
// //   <Path d="M88 122 Q100 142 112 122 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
// //   <Path d="M93 130 Q100 137 107 130 Q100 126 93 130Z" fill="#ff8aa0"/>
// // </Svg>;

// // // sun rays (rotates slowly behind the brain)
// // const Rays=({w}:any)=><Svg width={w} height={w} viewBox="0 0 200 200">
// //   {Array.from({length:12},(_,i)=>{const a=(i*30)*Math.PI/180,b=(i*30+14)*Math.PI/180;
// //     return <Polygon key={i} points={`100,100 ${100+Math.cos(a)*98},${100+Math.sin(a)*98} ${100+Math.cos(b)*98},${100+Math.sin(b)*98}`} fill="#ffe27a" opacity="0.55"/>})}
// //   <Circle cx="100" cy="100" r="64" fill="#fff6c8" opacity="0.9"/></Svg>;

// // // gold star with shine
// // const Star=({w}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
// //   <Polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill="#ffc72c" stroke={INK} strokeWidth="5" strokeLinejoin="round"/>
// //   <Polygon points="50,20 58,40 78,42 62,54 67,74 50,62 33,74 38,54 22,42 42,40" fill="#ffe07a"/>
// //   <Path d="M40 30 L46 24" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></Svg>;

// // // red ribbon banner
// // const Ribbon=({w}:any)=><Svg width={w} height={w*0.24} viewBox="0 0 300 72">
// //   <Polygon points="4,18 54,18 54,58 4,58 20,38" fill="#b7332a" stroke={INK} strokeWidth="3" strokeLinejoin="round"/>
// //   <Polygon points="296,18 246,18 246,58 296,58 280,38" fill="#b7332a" stroke={INK} strokeWidth="3" strokeLinejoin="round"/>
// //   <Rect x="34" y="6" width="232" height="50" rx="8" fill="#ef5a4c" stroke={INK} strokeWidth="3"/>
// //   <Rect x="40" y="11" width="220" height="10" rx="5" fill="#ff8d80"/>
// //   <Polygon points="34,56 50,56 34,68" fill="#7d1f19" stroke={INK} strokeWidth="2"/>
// //   <Polygon points="266,56 250,56 266,68" fill="#7d1f19" stroke={INK} strokeWidth="2"/></Svg>;

// // const CHEERS=[
// //   {a:'Math is easy...',b:'when you add a little confidence!'},
// //   {a:'Great job!',b:'Your brain is on fire!'},
// //   {a:'Smart move...',b:'you are getting sharper!'},
// //   {a:'Nice one!',b:'Keep that streak going!'},
// //   {a:'Wow...',b:'that was a tricky one!'}];

// // function Win({n,hints,msg,hasNext,onNext,onHome}:any){
// //   const cheer=CHEERS[(n-1)%CHEERS.length];
// //   const rib=useRef(new Animated.Value(0)).current,
// //     stars=useRef([0,1,2].map(()=>new Animated.Value(0))).current,
// //     pop=useRef(new Animated.Value(0)).current,bub=useRef(new Animated.Value(0)).current,btn=useRef(new Animated.Value(0)).current,
// //     bounce=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,spin=useRef(new Animated.Value(0)).current;
// //   useEffect(()=>{
// //     Animated.sequence([
// //       Animated.spring(rib,{toValue:1,friction:5,tension:90,useNativeDriver:true}),
// //       Animated.stagger(160,stars.map(v=>Animated.spring(v,{toValue:1,friction:3,tension:90,useNativeDriver:true}))),
// //       Animated.parallel([
// //         Animated.spring(pop,{toValue:1,friction:4,tension:80,useNativeDriver:true}),
// //         Animated.sequence([Animated.delay(150),Animated.spring(bub,{toValue:1,friction:5,tension:70,useNativeDriver:true})])]),
// //       Animated.spring(btn,{toValue:1,friction:5,tension:70,useNativeDriver:true})]).start();
// //     const loop=(v:Animated.Value,d:number)=>Animated.loop(Animated.sequence([Animated.timing(v,{toValue:1,duration:d,useNativeDriver:true}),Animated.timing(v,{toValue:0,duration:d,useNativeDriver:true})])).start();
// //     loop(bounce,650);loop(pulse,800);
// //     Animated.loop(Animated.timing(spin,{toValue:1,duration:12000,easing:Easing.linear,useNativeDriver:true})).start();
// //   },[]);
// //   const ribY=rib.interpolate({inputRange:[0,1],outputRange:[-90,0]});
// //   const starAnim=(v:Animated.Value)=>({opacity:v,transform:[{scale:v.interpolate({inputRange:[0,1],outputRange:[0,1]})},{rotate:v.interpolate({inputRange:[0,1],outputRange:['-60deg','0deg']})}]});
// //   const popS=pop.interpolate({inputRange:[0,1],outputRange:[0.2,1]});
// //   const bubS=bub.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
// //   const btnS=btn.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
// //   const pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.07]});
// //   const midS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.12]});
// //   const bY=bounce.interpolate({inputRange:[0,1],outputRange:[0,-12]});
// //   const bR=bounce.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
// //   const spinR=spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']});
// //   return <View style={wn.wood}>
// //     {[0,1,2,3,4,5,6,7].map(i=><View key={i} pointerEvents="none" style={[wn.plank,{top:90*i}]}/>)}

// //     <View style={wn.paper}>
// //       <View style={wn.holes}>{Array.from({length:11},(_,i)=><View key={i} style={wn.hole}/>)}</View>
// //       {Array.from({length:22},(_,i)=><View key={i} style={[wn.ln,{top:84+i*34}]}/>)}
// //       <View style={wn.margin}/>

// //       <View style={wn.head}>
// //         <TouchableOpacity onPress={onHome} style={wn.round}><Icon n="home" s={20}/></TouchableOpacity>
// //         <TouchableOpacity style={wn.round}><Icon n="gear" s={20}/></TouchableOpacity>
// //         <TouchableOpacity style={wn.round}><Icon n="dots" s={20}/></TouchableOpacity>
// //         <View style={{flex:1}}/>
// //         <View style={wn.pill}><Text style={wn.pn}>{hints}</Text><Icon n="bulb" s={22}/></View>
// //       </View>

// //       <View style={wn.body}>
// //         <Animated.View style={{alignItems:'center',justifyContent:'center',opacity:rib,transform:[{translateY:ribY}]}}>
// //           <Ribbon w={Math.min(W-40,330)}/>
// //           <Text style={wn.ribt} numberOfLines={1} adjustsFontSizeToFit>{'LEVEL '+n+' COMPLETE!'}</Text>
// //         </Animated.View>

// //         <View style={wn.starRow}>
// //           <Animated.View style={[{marginBottom:2},starAnim(stars[0])]}><Star w={62}/></Animated.View>
// //           <Animated.View style={[{marginHorizontal:6},starAnim(stars[1])]}><Animated.View style={{transform:[{scale:midS}]}}><Star w={86}/></Animated.View></Animated.View>
// //           <Animated.View style={[{marginBottom:2},starAnim(stars[2])]}><Star w={62}/></Animated.View>
// //         </View>

// //         <Animated.View style={[wn.msgWrap,{opacity:pop,transform:[{scale:popS}]}]}>
// //           <View style={wn.hl}/>
// //           <Text style={wn.msg} numberOfLines={2} adjustsFontSizeToFit>{msg}</Text>
// //         </Animated.View>

// //         <Animated.View style={{alignItems:'center',opacity:bub,transform:[{scale:bubS}]}}>
// //           <View style={wn.bubble}>
// //             <Text style={wn.b1}>{cheer.a}</Text>
// //             <Text style={wn.b2}>{cheer.b}</Text>
// //             <View style={{position:'absolute',right:14,top:12}}><Smiley w={24}/></View>
// //           </View>
// //           <View style={{marginTop:-3,alignSelf:'flex-end',marginRight:74}}>
// //             <Svg width={30} height={22} viewBox="0 0 34 26"><Polygon points="0,0 34,0 8,26" fill="#fff3a0"/><Path d="M0 0 L8 26 L34 0" stroke={INK} strokeWidth="2.5" fill="none" strokeDasharray="5 3"/></Svg>
// //           </View>
// //         </Animated.View>

// //         <View style={{alignItems:'center',justifyContent:'center',height:170}}>
// //           <Animated.View style={{position:'absolute',opacity:pop,transform:[{rotate:spinR}]}}><Rays w={230}/></Animated.View>
// //           <Animated.View style={{opacity:pop,transform:[{translateY:bY},{rotate:bR},{scale:popS}]}}><BrainHero w={170}/></Animated.View>
// //         </View>

// //         <Animated.View style={{opacity:btn,transform:[{scale:btnS}]}}>
// //           <Animated.View style={{transform:[{scale:pulseS}]}}>
// //             <TouchableOpacity activeOpacity={0.85} onPress={onNext} style={wn.btn}>
// //               <View style={wn.btnShine}/>
// //               <Text style={wn.btnt}>{hasNext?'NEXT':'DONE'}</Text>
// //               <Svg width={34} height={34} viewBox="0 0 24 24" style={{marginLeft:8}}>
// //                 <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
// //                 <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
// //               </Svg>
// //             </TouchableOpacity>
// //           </Animated.View>
// //         </Animated.View>
// //       </View>
// //     </View>

// //     <View pointerEvents="none" style={wn.sticky}><Smiley w={34}/></View>

// //     <View pointerEvents="none" style={wn.books}>
// //       {[['Think','#9b4fc0',130],['Learn','#2f7fd0',118],['Grow','#f0a830',124]].map(([t,c,w]:any,i)=>
// //         <View key={t} style={[wn.book,{backgroundColor:c,width:w,marginLeft:i===1?10:i===2?-4:0}]}><Text style={wn.bookt}>{t+' ♥'}</Text></View>)}
// //     </View>

// //     <View pointerEvents="none" style={wn.cup}>
// //       <View style={[wn.pen,{backgroundColor:'#ee6aa0',left:8,height:34,transform:[{rotate:'-12deg'}]}]}/>
// //       <View style={[wn.pen,{backgroundColor:'#f6c928',left:22,height:44}]}/>
// //       <View style={[wn.pen,{backgroundColor:'#2aa7b0',left:36,height:38,transform:[{rotate:'12deg'}]}]}/>
// //       <View style={wn.cupBody}><Smiley w={26}/></View>
// //     </View>

// //     <Confetti/>
// //   </View>}

// // function Level({n,player,hints,setHints,onWin,onHome}:any){
// //   const[lv,setLv]=useState<any>(null),[hid,setHid]=useState<number[]>([]),[hidOpt,setHidOpt]=useState<number[]>([]),[sel,setSel]=useState<number|null>(null),[count,setCount]=useState(0),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
// //     [mark,setMark]=useState<any>(null),[hand,setHand]=useState(true),
// //     [rain,setRain]=useState(false),[bloom,setBloom]=useState(false),[open,setOpen]=useState(false),[note,setNote]=useState(''),[done,setDone]=useState(false);
// //   const t=useRef(new Animated.Value(0)).current,pan=useRef(new Animated.ValueXY()).current,sc=useRef(new Animated.Value(1)).current;
// //   const lvR=useRef<any>(null),openR=useRef(false);lvR.current=lv;openR.current=open;
// //   const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1500)};
// //   const send=async(a:any)=>{try{return await api.answer(n,player.id,a)}catch(e){flash('Network error');return null}};
// //   useEffect(()=>{api.level(n).then(setLv).catch(()=>flash('Cannot load level '+n));
// //     Animated.loop(Animated.timing(t,{toValue:1,duration:800,useNativeDriver:true})).start()},[]);

// //   // choice level: tap an item (answer = item index)
// //   const pick=async(i:number)=>{if(done)return;setHand(false);const it=lv.items[i],r=await send(i);if(!r)return;
// //     setMark({x:it.x+it.w/2,y:it.y+it.w*0.45,ok:!!r.correct});
// //     if(r.correct){setDone(true);setTimeout(()=>onWin(r),1000)}else setTimeout(()=>setMark(null),800)};
// //   // choice level with number options (answer = the number)
// //   const pickOpt=async(o:number)=>{if(done)return;setHand(false);const r=await send(o);if(!r)return;
// //     if(r.correct){setSel(o);setDone(true);setTimeout(()=>onWin(r),900)}else flash('Not quite. Try again!')};
// //   // levels with a counter (- / +) or a keypad: send the typed number
// //   const submitNum=async(v:number)=>{if(done)return;setHand(false);const r=await send(v);if(!r)return;
// //     if(r.correct){setOv('check');setDone(true);setTimeout(()=>onWin(r),1000)}
// //     else{setOv('cross');flash('Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}};
// //   // old tap-the-cloud level (kept so old data still works)
// //   const cloud=()=>{if(rain)return;setHand(false);setRain(true);setTimeout(()=>setBloom(true),1700);setTimeout(async()=>{const r=await send(1);r?.correct&&onWin(r)},2800)};
// //   // multi-drag levels: every item with drag:true is dragged on its own
// //   //  mode 'combine' -> drop one item on another; sends {from,to} (smaller index first)
// //   //  mode 'away'    -> each one must be dragged away
// //   //  mode 'feed'    -> each one must be dropped on item lv.target
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
// //         if(r?.correct){setMerged({x:(A.x+B.x)/2+A.w/2-52,y:(A.y+B.y)/2+A.w/2-52,t:r.result??'',a,b});setDone(true);setTimeout(()=>onWin(r),1500)}
// //         else{flash('Not quite. Try again!');Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start()}
// //         return}
// //       let ok=false;
// //       if(l.mode==='away')ok=Math.hypot(g.dx,g.dy)>80;
// //       else{const cx=el.x+el.w/2+g.dx,cy=el.y+el.w/2+g.dy;ok=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w}
// //       if(!ok){Animated.spring(dPan[i],{toValue:{x:0,y:0},useNativeDriver:false}).start();return}
// //       goneR.current=[...goneR.current,i];
// //       if(l.mode==='feed')Animated.parallel([Animated.timing(dPan[i],{toValue:{x:fr.x+fr.w/2-(el.x+el.w/2),y:fr.y+fr.w*0.4-(el.y+el.w/2)},duration:350,useNativeDriver:false}),Animated.timing(dSc[i],{toValue:0.05,duration:350,useNativeDriver:false})]).start();
// //       const need=l.items.map((it:any,k:number)=>it.drag?k:-1).filter((k:number)=>k>=0);
// //       if(need.every((k:number)=>goneR.current.includes(k))){const r=await send({from:0,to});
// //         if(r?.correct){setDone(true);if(l.mode==='away')setBloom(true);setTimeout(()=>onWin(r),l.mode==='away'?2200:900)}}
// //     }}))).current;
// //   // drag level: item 0 is dragged onto item lv.target (default 1)
// //   const pr=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onPanResponderGrant:()=>setHand(false),
// //     onPanResponderMove:Animated.event([null,{dx:pan.x,dy:pan.y}],{useNativeDriver:false}),
// //     onPanResponderRelease:async(_,g)=>{const l=lvR.current,to=l.target??1,el=l.items[0],fr=l.items[to];
// //       const cx=el.x+el.w/2+g.dx,cy=el.y+el.w*0.55+g.dy;
// //       const hit=cx>fr.x&&cx<fr.x+fr.w&&cy>fr.y&&cy<fr.y+fr.w,needOpen=fr.k==='fridge';
// //       if(hit&&(!needOpen||openR.current)){const r=await send({from:0,to});if(r?.correct){
// //         setOpen(true);
// //         Animated.parallel([Animated.timing(sc,{toValue:.25,duration:500,useNativeDriver:false}),Animated.timing(pan,{toValue:{x:fr.x+fr.w*0.3-el.x,y:fr.y+fr.w*0.35-el.y},duration:500,useNativeDriver:false})]).start();
// //         setTimeout(()=>onWin(r),1100);return}}
// //       else if(hit)flash('Open the fridge first!');
// //       Animated.spring(pan,{toValue:{x:0,y:0},useNativeDriver:false}).start()}})).current;

// //   const hint=async()=>{try{const r=await api.hint(n,player.id,lvR.current?.options?hidOpt:hid);setHints(r.hints);const h=r.hint;
// //     if(h.removeOption!=null)setHidOpt([...hidOpt,h.removeOption]);else if(h.remove!=null)setHid([...hid,h.remove]);else if(h.text)flash(h.text)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
// //   const reward=async(k:string)=>{try{const r=await api.reward(player.id,k);setHints(r.hints)}catch(e){}};
// //   const skip=async()=>{try{const r=await api.skip(n,player.id);setHints(hints-50);onWin(r)}catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};

// //   const board=lv?.bg==='board';

// //   const stage=lv&&<View style={[st.stage,board&&{height:290,marginTop:0},lv.input==='keypad'?{height:10}:lv.input==='counter'?{height:240}:null]}>
// //       {(lv.items||[]).map((it:any,i:number)=>{if(board&&(it.k==='duster'||it.k==='chalk'))return null;
// //         const A=ART[it.k];if(!A)return <View key={i} pointerEvents="none" style={{position:'absolute',left:it.x,top:it.y,width:it.w,height:Math.max(40,it.w*0.6),borderWidth:2,borderColor:'#c0392b',borderStyle:'dashed',borderRadius:10,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:12,color:'#c0392b'}}>{'no art: '+it.k}</Text></View>;
// //         const body=<A w={it.w} t={it.t} grey={it.grey} bloom={bloom} open={open} i={i}/>,
// //         pos:any={position:'absolute',left:it.x,top:it.y,opacity:(merged&&(i===merged.a||i===merged.b))?0:hid.includes(i)?0.2:1,...(it.rot?{transform:[{rotate:it.rot+'deg'}]}:{})};
// //         // multi-drag levels (combine numbers / clouds away / both cookies to the cat)
// //         if(it.drag&&(lv.mode==='away'||lv.mode==='feed'||lv.mode==='combine'))return <Animated.View key={i} {...dPR[i].panHandlers} style={[pos,{zIndex:5+i,transform:[...dPan[i].getTranslateTransform(),{scale:dSc[i]}]}]}>{body}</Animated.View>;
// //         // tap-an-item levels only (NOT the counter / keypad levels)
// //         if(lv.type==='choice'&&!lv.options&&!lv.input)return <TouchableOpacity key={i} style={pos} disabled={hid.includes(i)} onPress={()=>pick(i)}>{body}</TouchableOpacity>;
// //         if(lv.type==='taps'&&it.k==='cloud')return <TouchableOpacity key={i} style={pos} onPress={cloud}>{body}</TouchableOpacity>;
// //         if(lv.type==='drag'&&!lv.mode&&i===0)return <Animated.View key={i} {...pr.panHandlers} style={[pos,{zIndex:5,transform:[...pan.getTranslateTransform(),{scale:sc}]}]}>{body}</Animated.View>;
// //         if(lv.type==='drag'&&it.k==='fridge')return <TouchableOpacity key={i} style={pos} onPress={()=>{setOpen(true);setHand(false)}}>{body}</TouchableOpacity>;
// //         return <View key={i} style={pos} pointerEvents="none">{body}</View>})}
// //       {merged&&<View pointerEvents="none" style={{position:'absolute',left:merged.x,top:merged.y,width:104,height:104,alignItems:'center',justifyContent:'center'}}><Text style={{fontFamily:F,fontSize:84,fontWeight:'900',color:CHALK,includeFontPadding:false,textShadowColor:'rgba(255,255,255,0.55)',textShadowRadius:4,textShadowOffset:{width:0,height:0}}}>{merged.t}</Text></View>}
// //       {rain&&[0,1,2,3,4,5,6].map(k=><Animated.View key={k} pointerEvents="none" style={{position:'absolute',left:70+k*28,top:80,opacity:t.interpolate({inputRange:[0,.85,1],outputRange:[1,1,0]}),
// //         transform:[{translateY:t.interpolate({inputRange:[0,1],outputRange:[(k%3)*12,90]})}]}}><Drop/></Animated.View>)}
// //       {mark&&<View pointerEvents="none" style={{position:'absolute',left:mark.x-24,top:mark.y-24}}><Icon n={mark.ok?'check':'cross'} s={48}/></View>}
// //       {hand&&lv.hand&&<View pointerEvents="none" style={{position:'absolute',left:lv.hand.x,top:lv.hand.y,zIndex:9}}><PointerHand w={70}/></View>}
// //     </View>;

// //   // ---------- chalkboard layout (same look as the reference design) ----------
// //   if(board)return <View style={bd.wall}>
// //     <View style={bd.frame}><View style={bd.board}>
// //       {/* chalk dust smudges */}
// //       <View pointerEvents="none" style={[bd.smudge,{top:90,left:-40,width:260,height:120,transform:[{rotate:'-14deg'}]}]}/>
// //       <View pointerEvents="none" style={[bd.smudge,{top:300,right:-60,width:300,height:140,transform:[{rotate:'10deg'}]}]}/>
// //       <View pointerEvents="none" style={[bd.smudge,{bottom:150,left:20,width:200,height:90,transform:[{rotate:'6deg'}]}]}/>

// //       {/* top bar: home + gear | hanging LEVEL sign | bulb counter */}
// //       <View style={bd.top}>
// //         <View style={bd.topL}><Round n="home" onPress={onHome}/><Round n="gear"/></View>
// //         <View style={bd.signWrap}>
// //           <View style={[bd.string,{left:26,transform:[{rotate:'12deg'}]}]}/><View style={[bd.string,{right:26,transform:[{rotate:'-12deg'}]}]}/>
// //           <View style={bd.sign}>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/></View>
// //             <Text style={bd.signt}>{'LEVEL '+n}</Text>
// //             <View style={bd.dashes}><View style={[bd.dash,{transform:[{rotate:'25deg'}]}]}/><View style={[bd.dash,{transform:[{rotate:'-25deg'}]}]}/></View>
// //           </View>
// //         </View>
// //         <View style={bd.topR}><View style={bd.bpill}><Text style={bd.bpt}>{hints}</Text><View style={{position:'absolute',right:-14,top:-10}}><Icon n="bulb" s={34}/></View></View></View>
// //       </View>

// //       <Text style={bd.q}>{lv.question}</Text>

// //       <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:240}}>{stage}</View>

// //       {/* eraser + pencil decoration */}
// //       <View pointerEvents="box-none" style={bd.decor}>
// //         <FreeDrag><View style={{transform:[{rotate:'-8deg'}]}}><Eraser w={84}/></View></FreeDrag>
// //         <FreeDrag><View style={{transform:[{rotate:'2deg'}]}}><Pencil w={150}/></View></FreeDrag>
// //       </View>

// //       {/* hint / video / skip buttons */}
// //       <View style={bd.actions}>
// //         <TouchableOpacity onPress={hint} activeOpacity={0.85} style={bd.hintBtn}><Icon n="search" s={34}/></TouchableOpacity>
// //         <TouchableOpacity onPress={()=>reward('video')} activeOpacity={0.85} style={bd.videoBtn}>
// //           <Icon n="film" s={40}/>
// //           <View style={bd.vlabel}><Coin s={12}/><Text style={bd.vlt}>+75</Text></View>
// //         </TouchableOpacity>
// //         <TouchableOpacity onPress={skip} activeOpacity={0.85} style={bd.skipBtn}><Icon n="play" s={36}/></TouchableOpacity>
// //       </View>

// //       {/* wooden ledge with duster + chalk */}
// //       <View style={bd.ledge}>
// //         {(lv.items||[]).filter((it:any)=>it.k==='duster').map((it:any,i:number)=><View key={'d'+i} style={{position:'absolute',left:16,bottom:20}}><Duster w={84}/></View>)}
// //         {(lv.items||[]).filter((it:any)=>it.k==='chalk').map((it:any,i:number)=><View key={'c'+i} style={{position:'absolute',left:'38%',bottom:20}}><Chalk w={90}/></View>)}
// //       </View>
// //       {!!note&&<Text style={bd.note}>{note}</Text>}
// //     </View></View>
// //     <View style={bd.wallBottom}/>
// //   </View>;

// //   // ---------- notebook layout (other levels) ----------
// //   return <Paper title={'LEVEL '+n} hints={hints} onHome={onHome} bottom={<Bar onHint={hint} onGift={()=>reward('gift')} onVideo={()=>reward('video')} onSkip={skip}/>}>
// //     {lv&&<><Text style={st.ql}>{lv.question}</Text>
// //     {stage}
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
// //     </>}
// //     {!!note&&<Text style={st.note}>{note}</Text>}
// //   </Paper>}

// // export default function BrainTwistFlow({onExit}:any){
// //   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),[n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');
// //   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||1))}).catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);
// //   if(scr==='splash')return <Splash onDone={()=>setScr('ready')}/>;
// //   if(scr==='ready')return <Ready hints={hints} n={n} onHome={onExit} err={err} onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;
// //   if(win)return <Win n={n} hints={hints} msg={win.message} hasNext={!!win.next} onHome={onExit} onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;
// //   return <Level key={n} n={n} player={player} hints={hints} setHints={setHints} onWin={setWin} onHome={onExit}/>}

// // /* ---------- WIN screen styles ---------- */
// // const wn=StyleSheet.create({
// //   wood:{flex:1,backgroundColor:'#c98a4e',paddingTop:30,paddingHorizontal:12,paddingBottom:44,overflow:'hidden'},
// //   plank:{position:'absolute',left:0,right:0,height:3,backgroundColor:'rgba(90,50,15,0.18)'},
// //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:6,shadowOffset:{width:0,height:3}},
// //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},
// //   hole:{width:16,height:22,borderRadius:8,backgroundColor:'#c98a4e'},
// //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#dbe9ee'},
// //   margin:{position:'absolute',left:30,top:0,bottom:0,width:2,backgroundColor:'rgba(240,120,120,0.35)'},
// //   head:{flexDirection:'row',alignItems:'center',gap:6,marginTop:12,paddingHorizontal:12},
// //   round:{width:38,height:38,borderRadius:19,backgroundColor:'#ffd21f',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   pill:{flexDirection:'row',alignItems:'center',gap:3,borderWidth:2.5,borderColor:INK,borderRadius:18,paddingHorizontal:10,backgroundColor:'#fff',height:34},
// //   pn:{fontFamily:F,fontSize:18,fontWeight:'900',color:INK},
// //   body:{flex:1,alignItems:'center',justifyContent:'space-around',paddingVertical:8,paddingHorizontal:10},
// //   ribt:{position:'absolute',fontFamily:F,fontSize:21,fontWeight:'900',color:'#fff',width:'62%',textAlign:'center',top:'24%',textShadowColor:'rgba(0,0,0,0.55)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
// //   starRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'center'},
// //   msgWrap:{alignItems:'center',justifyContent:'center',paddingHorizontal:10,maxWidth:'100%'},
// //   hl:{position:'absolute',left:0,right:0,bottom:4,height:16,borderRadius:8,backgroundColor:'#ffe45c',opacity:0.85},
// //   msg:{fontFamily:F,fontSize:42,fontWeight:'900',color:'#14213d',textAlign:'center'},
// //   bubble:{backgroundColor:'#fff3a0',borderWidth:2.5,borderColor:INK,borderStyle:'dashed',borderRadius:34,paddingHorizontal:24,paddingVertical:12,maxWidth:310},
// //   b1:{fontFamily:F,fontSize:20,fontWeight:'900',color:INK},
// //   b2:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#8e2fa8'},
// //   btn:{minWidth:250,height:64,borderRadius:32,backgroundColor:'#7fd83a',borderWidth:4,borderColor:INK,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:30,overflow:'hidden'},
// //   btnShine:{position:'absolute',top:3,left:18,right:18,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.4)'},
// //   btnt:{fontFamily:F,fontSize:34,fontWeight:'900',color:INK},
// //   sticky:{position:'absolute',top:18,right:-4,width:62,height:62,backgroundColor:'#ffe36b',alignItems:'center',justifyContent:'center',transform:[{rotate:'8deg'}],elevation:8,shadowColor:'#000',shadowOpacity:0.2,shadowRadius:3,shadowOffset:{width:0,height:2}},
// //   books:{position:'absolute',left:4,bottom:6},
// //   book:{height:30,borderRadius:4,justifyContent:'center',paddingHorizontal:14,marginTop:1,borderBottomWidth:3,borderBottomColor:'rgba(0,0,0,0.25)'},
// //   bookt:{fontFamily:F,fontSize:14,fontWeight:'900',color:'#fff'},
// //   cup:{position:'absolute',right:16,bottom:4,width:66,height:90},
// //   pen:{position:'absolute',top:0,width:10,borderRadius:3,borderTopLeftRadius:5,borderTopRightRadius:5},
// //   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:52,backgroundColor:'#2f7fd0',borderRadius:6,borderWidth:2.5,borderColor:'#1d5aa0',alignItems:'center',justifyContent:'center'}});

// // /* ---------- chalkboard level styles ---------- */
// // const bd=StyleSheet.create({
// //   wall:{flex:1,backgroundColor:'#f1dcc0'},
// //   frame:{flex:1,marginTop:30,marginHorizontal:6,borderWidth:10,borderColor:'#d98b3d',borderRadius:6,backgroundColor:'#1f5b44',overflow:'hidden'},
// //   board:{flex:1,alignItems:'center'},
// //   smudge:{position:'absolute',borderRadius:80,backgroundColor:'rgba(255,255,255,0.05)'},
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
// //   q:{fontFamily:F,fontSize:23,fontStyle:'italic',color:CHALK,textAlign:'center',marginTop:20,textShadowColor:'rgba(255,255,255,0.4)',textShadowRadius:3,textShadowOffset:{width:0,height:0}},
// //   decor:{position:'absolute',zIndex:30,elevation:30,left:0,right:0,bottom:160,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40},
// //   actions:{position:'absolute',left:0,right:0,bottom:84,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:34},
// //   hintBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:3,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
// //   videoBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f3efe2',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   vlabel:{position:'absolute',bottom:-14,right:-14,flexDirection:'row',alignItems:'center',gap:2},
// //   vlt:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'},
// //   skipBtn:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:3,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
// //   ledge:{position:'absolute',left:0,right:0,bottom:0,height:24,backgroundColor:'#d98b3d',borderTopWidth:3,borderTopColor:'#f0b06a'},
// //   note:{position:'absolute',bottom:40,alignSelf:'center',fontFamily:F,fontSize:17,color:'#ffb4a8'},
// //   wallBottom:{height:18}});

// // /* ---------- READY screen styles ---------- */
// // const rd=StyleSheet.create({
// //   wrap:{flex:1,backgroundColor:'#1a1445',paddingTop:34,overflow:'hidden'},
// //   window:{position:'absolute',right:-6,top:170,width:70,height:290,backgroundColor:'rgba(43,86,200,0.55)',borderWidth:4,borderColor:'#3a2a8a'},
// //   winV:{position:'absolute',left:'48%',top:0,bottom:0,width:4,backgroundColor:'#3a2a8a'},
// //   winH:{position:'absolute',left:0,right:0,top:'34%',height:4,backgroundColor:'#3a2a8a'},
// //   shelf:{position:'absolute',left:0,right:0,bottom:96,flexDirection:'row',alignItems:'flex-end',justifyContent:'center',opacity:0.35},
// //   lamp:{position:'absolute',top:0,left:W*0.55,alignItems:'center'},
// //   plant:{position:'absolute',left:-22,bottom:150},
// //   top:{flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10,zIndex:5},
// //   tb:{width:46,height:46,borderRadius:23,backgroundColor:'#1a2a6a',borderWidth:3,alignItems:'center',justifyContent:'center'},
// //   cpill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#241a6e',borderWidth:3,borderColor:'#6a4fe0',borderRadius:24,paddingHorizontal:10,height:46},
// //   cnum:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#fff',minWidth:16,textAlign:'center'},
// //   cplus:{width:26,height:26,borderRadius:13,backgroundColor:'#2fc24a',alignItems:'center',justifyContent:'center'},
// //   cplust:{color:'#fff',fontWeight:'900',fontSize:18,lineHeight:22},
// //   nb:{flex:1,marginHorizontal:24,marginTop:96,marginBottom:150},
// //   nbIn:{...StyleSheet.absoluteFillObject,backgroundColor:'#f7efdd',borderRadius:20,overflow:'hidden',borderBottomWidth:6,borderBottomColor:'#d9cdb0'},
// //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e7dcc2'},
// //   rings:{position:'absolute',top:-14,left:0,right:0,flexDirection:'row',justifyContent:'space-around',paddingHorizontal:16},
// //   ring:{width:12,height:34,borderRadius:6,backgroundColor:'#1c2350',borderWidth:2,borderColor:'#4a5ac0'},
// //   content:{flex:1,alignItems:'center',paddingTop:96,paddingHorizontal:14},
// //   qBlob:{backgroundColor:'#dcd6f5',borderRadius:30,paddingHorizontal:20,paddingVertical:14},
// //   q:{fontFamily:F,fontSize:26,fontWeight:'900',color:'#1c2350',textAlign:'center',lineHeight:34},
// //   btnOuter:{backgroundColor:'#0f5a2a',borderRadius:42,padding:4,elevation:6,shadowColor:'#000',shadowOpacity:0.3,shadowRadius:5,shadowOffset:{width:0,height:4}},
// //   btnIn:{backgroundColor:'#34c73c',borderRadius:38,paddingHorizontal:42,paddingVertical:14,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden'},
// //   btnShine:{position:'absolute',top:4,left:20,right:20,height:14,borderRadius:7,backgroundColor:'rgba(255,255,255,0.35)'},
// //   btnt:{fontFamily:F,fontSize:42,fontWeight:'900',color:'#fff',textShadowColor:'rgba(0,60,20,0.6)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
// //   err:{color:'#d63a5a',marginTop:14,fontFamily:F,fontSize:15,textAlign:'center'},
// //   tsg:{position:'absolute',left:16,bottom:18,fontFamily:F,fontSize:17,fontStyle:'italic',fontWeight:'bold',color:'#6a5fd0',lineHeight:21,transform:[{rotate:'-8deg'}]},
// //   lvTag:{position:'absolute',top:20,right:24,backgroundColor:'#5b4fe0',paddingHorizontal:18,paddingVertical:6,borderRadius:6},
// //   lvt:{fontFamily:F,fontSize:24,fontWeight:'900',color:'#fff'},
// //   mascot:{position:'absolute',top:-82,left:22},
// //   desk:{position:'absolute',left:0,right:0,bottom:0,height:96,backgroundColor:'#b0622a',borderTopWidth:5,borderTopColor:'#d98b4a'},
// //   books:{position:'absolute',left:-8,bottom:62},
// //   book:{height:46,borderRadius:6,flexDirection:'row',alignItems:'center',paddingLeft:14,marginTop:2,borderBottomWidth:4,borderBottomColor:'rgba(0,0,0,0.25)'},
// //   bookIc:{width:32,height:32,borderRadius:16,borderWidth:2,borderColor:'rgba(255,255,255,0.6)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.12)'},
// //   bookt:{fontFamily:F,fontSize:20,fontWeight:'bold',color:'#fff',marginLeft:12,flex:1},
// //   bookPg:{width:30,height:30,borderRadius:4,marginRight:10,borderWidth:2,borderColor:'rgba(255,255,255,0.35)'},
// //   cup:{position:'absolute',right:-6,bottom:62,width:90,height:132},
// //   pen:{position:'absolute',top:0,width:11,borderRadius:3,borderTopLeftRadius:6,borderTopRightRadius:6},
// //   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:74,backgroundColor:'#f7f5ee',borderRadius:10,borderWidth:3,borderColor:'#d8d4c8',alignItems:'center',justifyContent:'center'}});

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
// //   err:{color:'#c0392b',marginTop:14,fontFamily:F},
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
// //   bar:{flexDirection:'row',justifyContent:'center',gap:22,paddingBottom:12,paddingTop:4},bcircle:{width:50,height:50,borderRadius:25,borderWidth:2.5,alignItems:'center',justifyContent:'center'},cost:{fontFamily:F,fontWeight:'bold',fontSize:15,color:INK,marginLeft:2},
// //   msg:{fontFamily:F,fontSize:24,fontWeight:'bold',textTransform:'uppercase',color:INK,marginBottom:34,textAlign:'center'},
// //   next:{backgroundColor:GREEN,borderWidth:3,borderColor:INK,borderRadius:26,paddingHorizontal:46,paddingVertical:14},nt:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
// //   splash:{flex:1,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},pct:{position:'absolute',fontFamily:F,fontSize:34,fontWeight:'bold',color:'#d11'}});
// import React,{useEffect,useState} from 'react';
// import * as api from './api';
// import BTSplashScreen from './BTSplashScreen';
// import BTHomeScreen from './BTHomeScreen';
// import BTGameScreen from './BTGameScreen';
// import BTCongratsScreen from './BTCongratsScreen';

// export default function BrainTwistFlow({onExit}:any){
//   const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),
//     [n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');

//   useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(Math.min(p.currentLevel,p.total||1))})
//     .catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);

//   if(scr==='splash')return <BTSplashScreen onDone={()=>setScr('ready')}/>;

//   if(scr==='ready')return <BTHomeScreen hints={hints} n={n} err={err} onHome={onExit}
//     onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;

//   if(win)return <BTCongratsScreen key={'w'+n} n={n} hints={hints} playerId={player?.id} stats={win._stats} hasNext={!!win.next} onHome={onExit}
//     onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;

//   return <BTGameScreen key={n} n={n} player={player} hints={hints} setHints={setHints}
//     onWin={(r:any,s:any)=>setWin({...r,_stats:s})} onHome={onExit}/>}
import React,{useEffect,useState} from 'react';
import * as api from './api';
import BTSplashScreen from './BTSplashScreen';
import BTHomeScreen from './BTHomeScreen';
import BTGameScreen from './BTGameScreen';
import BTCongratsScreen from './BTCongratsScreen';

// TEST SWITCH
//   2    -> READY opens level 2 directly (the home screen shows "LEVEL 2")
//   null -> normal play (opens the level the player has reached)
const FORCE_LEVEL:number|null=2;

export default function BrainTwistFlow({onExit}:any){
  const[scr,setScr]=useState('splash'),[player,setPlayer]=useState<any>(null),[win,setWin]=useState<any>(null),
    [n,setN]=useState(1),[hints,setHints]=useState(50),[err,setErr]=useState('');

  useEffect(()=>{api.guest().then(p=>{setPlayer(p);setHints(p.hints);setN(FORCE_LEVEL??Math.min(p.currentLevel,p.total||1))})
    .catch(()=>setErr('Cannot reach server. Check config.ts'))},[]);

  if(scr==='splash')return <BTSplashScreen onDone={()=>setScr('ready')}/>;

  if(scr==='ready')return <BTHomeScreen hints={hints} n={n} err={err} onHome={onExit}
    onGo={()=>{if(player){setWin(null);setScr('level')}}}/>;

  if(win)return <BTCongratsScreen key={'w'+n} n={n} hints={hints} playerId={player?.id} stats={win._stats} hasNext={!!win.next} onHome={onExit}
    onNext={()=>{if(win.next){setPlayer((p:any)=>p&&({...p,currentLevel:Math.max(p.currentLevel,win.next)}));setN(win.next);setWin(null)}else onExit()}}/>;

  console.log('[BrainTwistFlow] opening level',n,'player',player?.id);

  return <BTGameScreen key={n} n={n} player={player} hints={hints} setHints={setHints}
    onWin={(r:any,s:any)=>setWin({...r,_stats:s})} onHome={onExit}/>}
