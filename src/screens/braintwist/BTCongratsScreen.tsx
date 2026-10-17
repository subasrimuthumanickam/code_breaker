// // import React,{useEffect,useRef,useState} from 'react';
// // import {View,Text,TouchableOpacity,Animated,Easing,StyleSheet,useWindowDimensions} from 'react-native';
// // import Svg,{Rect,Path,Circle,Polygon,Line,Ellipse} from 'react-native-svg';
// // import {F,INK,Stage,Smiley,Confetti,loop,useStageW} from './BTShared';
// // import * as progress from './progressApi';

// // // same formula as backend (used only if the server can't be reached)
// // const localStars=(tries:number,hints:number,skipped:boolean)=>skipped?1:Math.max(1,(tries<=1?3:tries===2?2:1)-(hints>0?1:0));

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

// // const Rays=({w}:any)=><Svg width={w} height={w} viewBox="0 0 200 200">
// //   {Array.from({length:12},(_,i)=>{const a=(i*30)*Math.PI/180,b=(i*30+14)*Math.PI/180;
// //     return <Polygon key={i} points={`100,100 ${100+Math.cos(a)*98},${100+Math.sin(a)*98} ${100+Math.cos(b)*98},${100+Math.sin(b)*98}`} fill="#ffe27a" opacity="0.55"/>})}
// //   <Circle cx="100" cy="100" r="64" fill="#fff6c8" opacity="0.9"/></Svg>;

// // const Star=({w,on}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
// //   <Polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill={on?'#ffc72c':'#e3dccb'} stroke={on?INK:'#9a937f'} strokeWidth="5" strokeLinejoin="round"/>
// //   {on&&<><Polygon points="50,20 58,40 78,42 62,54 67,74 50,62 33,74 38,54 22,42 42,40" fill="#ffe07a"/><Path d="M40 30 L46 24" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></>}</Svg>;

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

// // export default function BTCongratsScreen({n,hints,playerId,stats,hasNext,onNext,onHome}:any){
// //   const sw=useStageW(),{height:H}=useWindowDimensions();
// //   const k=Math.max(0.62,Math.min(1,(H-330)/430));          // shrink on small phones
// //   const ribW=Math.round(Math.min(sw-48,330)*(0.8+0.2*k)),ribFs=Math.max(12,Math.min(22,Math.floor(ribW*0.64/11.2)));
// //   const cheer=CHEERS[(n-1)%CHEERS.length],bs=Math.round(20*Math.max(0.85,k));

// //   // ---- frontend -> backend -> DB ----
// //   const[res,setRes]=useState<any>(null),[saveErr,setSaveErr]=useState(false),saved=useRef(false);
// //   useEffect(()=>{if(saved.current)return;saved.current=true;
// //     progress.complete({playerId,level:n,attempts:stats?.tries??1,hintsUsed:stats?.hints??0,skipped:!!stats?.skipped})
// //       .then(setRes).catch(()=>setSaveErr(true))},[]);
// //   const earned=res?.stars??localStars(stats?.tries??1,stats?.hints??0,!!stats?.skipped);

// //   const rib=useRef(new Animated.Value(0)).current,stars=useRef([0,1,2].map(()=>new Animated.Value(0))).current,
// //     bub=useRef(new Animated.Value(0)).current,pop=useRef(new Animated.Value(0)).current,btn=useRef(new Animated.Value(0)).current,
// //     bounce=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,spin=useRef(new Animated.Value(0)).current;
// //   useEffect(()=>{
// //     Animated.sequence([
// //       Animated.spring(rib,{toValue:1,friction:5,tension:90,useNativeDriver:true}),
// //       Animated.stagger(160,stars.map(v=>Animated.spring(v,{toValue:1,friction:3,tension:90,useNativeDriver:true}))),
// //       Animated.parallel([Animated.spring(bub,{toValue:1,friction:5,tension:70,useNativeDriver:true}),Animated.spring(pop,{toValue:1,friction:4,tension:80,useNativeDriver:true})]),
// //       Animated.spring(btn,{toValue:1,friction:5,tension:70,useNativeDriver:true})]).start();
// //     loop(bounce,650);loop(pulse,800);
// //     Animated.loop(Animated.timing(spin,{toValue:1,duration:12000,easing:Easing.linear,useNativeDriver:true})).start();
// //   },[]);
// //   const ribY=rib.interpolate({inputRange:[0,1],outputRange:[-90,0]});
// //   const starAnim=(v:Animated.Value)=>({opacity:v,transform:[{scale:v},{rotate:v.interpolate({inputRange:[0,1],outputRange:['-60deg','0deg']})}]});
// //   const bubS=bub.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),popS=pop.interpolate({inputRange:[0,1],outputRange:[0.2,1]}),
// //     btnS=btn.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.07]}),
// //     midS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.12]}),bY=bounce.interpolate({inputRange:[0,1],outputRange:[0,-12]}),
// //     bR=bounce.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}),spinR=spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']});
// //   const sizes=[Math.round(62*k),Math.round(86*k),Math.round(62*k)];

// //   return <Stage bg="#c98a4e"><View style={wn.wood}>
// //     {[0,1,2,3,4,5,6,7,8].map(i=><View key={i} pointerEvents="none" style={[wn.plank,{top:90*i}]}/>)}

// //     <View style={wn.paper}>
// //       <View style={wn.holes}>{Array.from({length:11},(_,i)=><View key={i} style={wn.hole}/>)}</View>
// //       {Array.from({length:24},(_,i)=><View key={i} style={[wn.ln,{top:84+i*34}]}/>)}
// //       <View style={wn.margin}/>

// //       <View style={wn.head}>
// //         <TouchableOpacity onPress={onHome} style={wn.round}><Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill={INK}/></Svg></TouchableOpacity>
// //         <View style={{flex:1}}/>
// //         <View style={wn.pill}><Text style={wn.pn}>{hints}</Text><Text style={{fontSize:18}}>💡</Text></View>
// //       </View>

// //       <View style={wn.body}>
// //         <Animated.View style={{alignItems:'center',justifyContent:'center',opacity:rib,transform:[{translateY:ribY}]}}>
// //           <Ribbon w={ribW}/>
// //           <Text numberOfLines={1} style={[wn.ribt,{fontSize:ribFs,top:ribW*0.24*0.26}]}>{'LEVEL '+n+' COMPLETE!'}</Text>
// //         </Animated.View>

// //         <View style={wn.starRow}>
// //           {[0,1,2].map(i=>{const mid=i===1;
// //             const core=<Star w={sizes[i]} on={i<earned}/>;
// //             return <Animated.View key={i} style={[{marginHorizontal:mid?6:0,marginBottom:mid?0:2},starAnim(stars[i])]}>
// //               {mid?<Animated.View style={{transform:[{scale:midS}]}}>{core}</Animated.View>:core}</Animated.View>})}
// //         </View>

// //         <Animated.View style={{alignItems:'center',opacity:bub,transform:[{scale:bubS}]}}>
// //           <View style={wn.bubble}>
// //             <Text style={[wn.b1,{fontSize:bs}]}>{cheer.a}</Text>
// //             <Text style={[wn.b2,{fontSize:bs}]}>{cheer.b}</Text>
// //             <View style={{position:'absolute',right:14,top:10}}><Smiley w={22}/></View>
// //           </View>
// //           <View style={{marginTop:-3,alignSelf:'flex-end',marginRight:70}}>
// //             <Svg width={28} height={21} viewBox="0 0 34 26"><Polygon points="0,0 34,0 8,26" fill="#fff3a0"/><Path d="M0 0 L8 26 L34 0" stroke={INK} strokeWidth="2.5" fill="none" strokeDasharray="5 3"/></Svg>
// //           </View>
// //         </Animated.View>

// //         <View style={{alignItems:'center',justifyContent:'center',height:Math.round(170*k)}}>
// //           <Animated.View style={{position:'absolute',opacity:pop,transform:[{rotate:spinR}]}}><Rays w={Math.round(230*k)}/></Animated.View>
// //           <Animated.View style={{opacity:pop,transform:[{translateY:bY},{rotate:bR},{scale:popS}]}}><BrainHero w={Math.round(170*k)}/></Animated.View>
// //         </View>
// //       </View>

// //       {/* footer: NEXT button always visible */}
// //       <View style={wn.footer}>
// //         <Text style={[wn.saved,{color:saveErr?'#c0392b':res?'#2f8a3a':'#8a8a8a'}]}>{saveErr?'Offline - progress not saved':res?'Progress saved ✓':'Saving progress...'}</Text>
// //         <Animated.View style={{opacity:btn,transform:[{scale:btnS}]}}>
// //           <Animated.View style={{transform:[{scale:pulseS}]}}>
// //             <TouchableOpacity activeOpacity={0.85} onPress={onNext} style={wn.btn}>
// //               <View style={wn.btnShine}/>
// //               <Text style={wn.btnt}>{hasNext?'NEXT':'DONE'}</Text>
// //               <Svg width={32} height={32} viewBox="0 0 24 24" style={{marginLeft:8}}>
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
// //   </View></Stage>}

// // const wn=StyleSheet.create({
// //   // paddingBottom 110 -> paper ends above the books, so the NEXT button never hides behind them
// //   wood:{flex:1,backgroundColor:'#c98a4e',paddingTop:30,paddingHorizontal:12,paddingBottom:110,overflow:'hidden'},
// //   plank:{position:'absolute',left:0,right:0,height:3,backgroundColor:'rgba(90,50,15,0.18)'},
// //   paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:6,shadowOffset:{width:0,height:3}},
// //   holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},
// //   hole:{width:16,height:22,borderRadius:8,backgroundColor:'#c98a4e'},
// //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#dbe9ee'},
// //   margin:{position:'absolute',left:30,top:0,bottom:0,width:2,backgroundColor:'rgba(240,120,120,0.35)'},
// //   head:{flexDirection:'row',alignItems:'center',gap:6,marginTop:10,paddingLeft:12,paddingRight:62},
// //   round:{width:36,height:36,borderRadius:18,backgroundColor:'#ffd21f',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
// //   pill:{flexDirection:'row',alignItems:'center',gap:3,borderWidth:2.5,borderColor:INK,borderRadius:18,paddingHorizontal:10,backgroundColor:'#fff',height:34},
// //   pn:{fontFamily:F,fontSize:18,fontWeight:'900',color:INK},
// //   body:{flex:1,alignItems:'center',justifyContent:'space-around',paddingVertical:4,paddingHorizontal:10},
// //   ribt:{position:'absolute',fontFamily:F,fontWeight:'900',color:'#fff',textAlign:'center',textShadowColor:'rgba(0,0,0,0.55)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
// //   starRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'center'},
// //   bubble:{backgroundColor:'#fff3a0',borderWidth:2.5,borderColor:INK,borderStyle:'dashed',borderRadius:30,paddingHorizontal:22,paddingVertical:10,maxWidth:310},
// //   b1:{fontFamily:F,fontWeight:'900',color:INK},
// //   b2:{fontFamily:F,fontWeight:'900',color:'#8e2fa8'},
// //   footer:{alignItems:'center',paddingBottom:14,paddingTop:4},
// //   saved:{fontFamily:F,fontSize:13,fontWeight:'bold',marginBottom:6},
// //   btn:{minWidth:240,height:62,borderRadius:31,backgroundColor:'#7fd83a',borderWidth:4,borderColor:INK,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:30,overflow:'hidden'},
// //   btnShine:{position:'absolute',top:3,left:18,right:18,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.4)'},
// //   btnt:{fontFamily:F,fontSize:32,fontWeight:'900',color:INK},
// //   sticky:{position:'absolute',top:18,right:-4,width:62,height:62,backgroundColor:'#ffe36b',alignItems:'center',justifyContent:'center',transform:[{rotate:'8deg'}],elevation:8,shadowColor:'#000',shadowOpacity:0.2,shadowRadius:3,shadowOffset:{width:0,height:2}},
// //   books:{position:'absolute',left:4,bottom:6},
// //   book:{height:30,borderRadius:4,justifyContent:'center',paddingHorizontal:14,marginTop:1,borderBottomWidth:3,borderBottomColor:'rgba(0,0,0,0.25)'},
// //   bookt:{fontFamily:F,fontSize:14,fontWeight:'900',color:'#fff'},
// //   cup:{position:'absolute',right:16,bottom:4,width:66,height:90},
// //   pen:{position:'absolute',top:0,width:10,borderRadius:3,borderTopLeftRadius:5,borderTopRightRadius:5},
// //   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:52,backgroundColor:'#2f7fd0',borderRadius:6,borderWidth:2.5,borderColor:'#1d5aa0',alignItems:'center',justifyContent:'center'}});
// import React,{useEffect,useRef,useState} from 'react';
// import {View,Text,TouchableOpacity,Animated,Easing,StyleSheet,useWindowDimensions} from 'react-native';
// import Svg,{Rect,Path,Circle,Polygon,Line,Ellipse} from 'react-native-svg';
// import {F,INK,Stage,Smiley,Confetti,loop,useStageW} from './BTShared';
// import * as progress from './progressApi';

// const NAVY='#10245e';

// // same formula as backend (used only if the server can't be reached)
// const localStars=(tries:number,hints:number,skipped:boolean)=>skipped?1:Math.max(1,(tries<=1?3:tries===2?2:1)-(hints>0?1:0));

// // local ping-pong loop (native driver) used by the background animations
// const yoyo=(v:Animated.Value,ms:number)=>Animated.loop(Animated.sequence([
//   Animated.timing(v,{toValue:1,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
//   Animated.timing(v,{toValue:0,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true})])).start();

// const BrainHero=({w}:any)=><Svg width={w} height={w*0.95} viewBox="0 0 200 190">
//   <Ellipse cx="100" cy="184" rx="62" ry="6" fill="#d9cdf0"/>
//   <Line x1="86" y1="148" x2="84" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
//   <Line x1="114" y1="148" x2="116" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
//   <Ellipse cx="80" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
//   <Ellipse cx="120" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
//   <Path d="M70 174 H90 M110 174 H130" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
//   <Path d="M52 112 Q36 106 30 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
//   <Path d="M148 112 Q164 106 170 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
//   <Rect x="16" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
//   <Rect x="22" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
//   <Rect x="158" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
//   <Rect x="169" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
//   {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
//     <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
//   {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
//     <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
//   <Path d="M78 52 Q90 62 82 74 M120 50 Q110 62 120 72 M58 92 Q70 98 64 110 M144 92 Q132 100 138 112" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
//   <Circle cx="62" cy="116" r="8" fill="#ff7a96" opacity="0.7"/><Circle cx="138" cy="116" r="8" fill="#ff7a96" opacity="0.7"/>
//   <Circle cx="80" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
//   <Circle cx="120" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
//   <Path d="M99 96 Q100 92 101 96" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
//   <Path d="M70 100 Q80 88 90 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
//   <Path d="M110 100 Q120 88 130 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
//   <Path d="M88 122 Q100 142 112 122 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
//   <Path d="M93 130 Q100 137 107 130 Q100 126 93 130Z" fill="#ff8aa0"/>
// </Svg>;

// const Star=({w,on}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
//   <Polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill={on?'#ffc72c':'#e3dccb'} stroke={on?'#9a5a1f':'#9a937f'} strokeWidth="5" strokeLinejoin="round"/>
//   {on&&<><Polygon points="50,20 58,40 78,42 62,54 67,74 50,62 33,74 38,54 22,42 42,40" fill="#ffe07a"/><Path d="M40 30 L46 24" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></>}</Svg>;

// const Rocket=()=><Svg width={64} height={96} viewBox="0 0 64 96">
//   <Path d="M32 96 C22 84 26 74 32 66 C38 74 42 84 32 96Z" fill="#ff9a2e"/>
//   <Path d="M32 90 C27 82 29 76 32 72 C35 76 37 82 32 90Z" fill="#ffd93a"/>
//   <Path d="M14 56 L2 76 L18 68Z" fill="#ef4b4b"/><Path d="M50 56 L62 76 L46 68Z" fill="#ef4b4b"/>
//   <Path d="M32 4 C48 18 48 50 44 68 H20 C16 50 16 18 32 4Z" fill="#fff" stroke="#d9e2f2" strokeWidth="2"/>
//   <Path d="M32 4 C40 11 44 20 45 28 H19 C20 20 24 11 32 4Z" fill="#ef4b4b"/>
//   <Circle cx="32" cy="44" r="9" fill="#3b8fe8" stroke="#1c4a9a" strokeWidth="3"/></Svg>;

// const CHEERS=[
//   {a:'Math is easy...',b:'when you add a little confidence!'},
//   {a:'Great job!',b:'Your brain is on fire!'},
//   {a:'Smart move...',b:'you are getting sharper!'},
//   {a:'Nice one!',b:'Keep that streak going!'},
//   {a:'Wow...',b:'that was a tricky one!'}];

// /* ---------- animated background pieces ---------- */
// const Leaf=({l,b,w,h,r,c}:any)=><View style={{position:'absolute',left:l,bottom:b,width:w,height:h,borderRadius:h/2,backgroundColor:c||'#5fae3a',transform:[{rotate:r+'deg'}]}}/>;

// const DriftCloud=({W,top,scale,ms,delay}:any)=>{
//   const p=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.loop(Animated.timing(p,{toValue:1,duration:ms,easing:Easing.linear,useNativeDriver:true}))]).start()},[]);
//   return <Animated.View pointerEvents="none" style={{position:'absolute',top,transform:[{translateX:p.interpolate({inputRange:[0,1],outputRange:[-200,W+200]})},{scale}]}}>
//     <View style={{width:130,height:34,borderRadius:17,backgroundColor:'rgba(255,255,255,0.95)'}}/>
//     <View style={{position:'absolute',left:14,top:-18,width:46,height:46,borderRadius:23,backgroundColor:'rgba(255,255,255,0.95)'}}/>
//     <View style={{position:'absolute',left:46,top:-30,width:62,height:62,borderRadius:31,backgroundColor:'rgba(255,255,255,0.95)'}}/>
//     <View style={{position:'absolute',left:88,top:-14,width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,0.95)'}}/></Animated.View>};

// const Twinkle=({x,y,w,delay}:any)=>{
//   const p=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.loop(Animated.sequence([
//     Animated.timing(p,{toValue:1,duration:900,useNativeDriver:true}),Animated.timing(p,{toValue:0,duration:900,useNativeDriver:true})]))]).start()},[]);
//   return <Animated.View pointerEvents="none" style={{position:'absolute',left:x,top:y,opacity:p.interpolate({inputRange:[0,1],outputRange:[0.55,1]}),
//     transform:[{scale:p.interpolate({inputRange:[0,1],outputRange:[0.85,1.15]})},{rotate:p.interpolate({inputRange:[0,1],outputRange:['-12deg','12deg']})}]}}><Star w={w} on/></Animated.View>};

// function SkyBg({W,H}:any){
//   const fl=useRef(new Animated.Value(0)).current,pl=useRef(new Animated.Value(0)).current,rk=useRef(new Animated.Value(0)).current,sn=useRef(new Animated.Value(0)).current,sp=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{yoyo(fl,2600);yoyo(pl,2800);yoyo(rk,1700);yoyo(sn,1600);
//     Animated.loop(Animated.timing(sp,{toValue:1,duration:22000,easing:Easing.linear,useNativeDriver:true})).start()},[]);
//   const spinR=sp.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']}),
//     sunS=sn.interpolate({inputRange:[0,1],outputRange:[1,1.07]}),
//     plantR=pl.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}),
//     rkY=rk.interpolate({inputRange:[0,1],outputRange:[0,-12]}),
//     rkX=rk.interpolate({inputRange:[0,1],outputRange:[0,8]});
//   return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
//     {/* sky layers */}
//     <View style={{position:'absolute',left:0,right:0,top:0,height:'40%',backgroundColor:'#4aa6ee'}}/>
//     <View style={{position:'absolute',left:0,right:0,top:'40%',height:'30%',backgroundColor:'#7cc8f6'}}/>
//     <View style={{position:'absolute',left:0,right:0,top:'70%',bottom:0,backgroundColor:'#a8defa'}}/>
//     <DriftCloud W={W} top={H*0.06} scale={1.1} ms={32000} delay={0}/>
//     <DriftCloud W={W} top={H*0.34} scale={0.8} ms={40000} delay={9000}/>
//     <DriftCloud W={W} top={H*0.58} scale={0.9} ms={36000} delay={18000}/>
//     {/* sun with face */}
//     <View style={{position:'absolute',right:-38,top:H*0.15,width:130,height:130,alignItems:'center',justifyContent:'center'}}>
//       <Animated.View style={{position:'absolute',width:170,height:170,transform:[{rotate:spinR}]}}>
//         {Array.from({length:10}).map((_,i)=><View key={i} style={{position:'absolute',width:170,height:170,transform:[{rotate:(i*36)+'deg'}]}}>
//           <View style={{position:'absolute',left:74,top:0,width:22,height:32,borderRadius:11,backgroundColor:'#ffd93a'}}/></View>)}
//       </Animated.View>
//       <Animated.View style={{transform:[{scale:sunS}]}}>
//         <View style={{width:112,height:112,borderRadius:56,backgroundColor:'#ffd93a',borderWidth:3,borderColor:'#ffe98a',alignItems:'center',paddingTop:34}}>
//           <View style={{flexDirection:'row',gap:20}}><View style={ws.eye}/><View style={ws.eye}/></View>
//           <View style={{width:22,height:11,marginTop:6,borderBottomLeftRadius:11,borderBottomRightRadius:11,borderWidth:3,borderTopWidth:0,borderColor:'#8a4a1a'}}/>
//           <View style={[ws.cheek,{left:14,top:56}]}/><View style={[ws.cheek,{right:14,top:56}]}/>
//         </View>
//       </Animated.View>
//     </View>
//     {/* rocket */}
//     <Animated.View style={{position:'absolute',left:8,top:H*0.13,transform:[{translateY:rkY},{translateX:rkX},{rotate:'32deg'}]}}><Rocket/></Animated.View>
//     {/* floating stars */}
//     <Twinkle x={W*0.22} y={H*0.03} w={34} delay={0}/>
//     <Twinkle x={W*0.62} y={H*0.07} w={30} delay={500}/>
//     <Twinkle x={W*0.04} y={H*0.33} w={34} delay={900}/>
//     <Twinkle x={W*0.9} y={H*0.37} w={30} delay={300}/>
//     <Twinkle x={W*0.8} y={H*0.55} w={22} delay={1200}/>
//     {/* hills */}
//     <View style={{position:'absolute',left:-70,bottom:92,width:300,height:170,borderRadius:150,backgroundColor:'#7ccf6e'}}/>
//     <View style={{position:'absolute',right:-90,bottom:92,width:320,height:140,borderRadius:160,backgroundColor:'#6fc2a4'}}/>
//     {[[30,150],[62,170],[96,146]].map((f,i)=><View key={i} style={{position:'absolute',left:f[0],bottom:f[1],width:16,height:16,borderRadius:8,backgroundColor:i===1?'#e58fd0':'#c9a1ef'}}/>)}
//     {/* plant (left) */}
//     <Animated.View style={{position:'absolute',left:-8,bottom:98,width:110,height:150,transform:[{rotate:plantR}]}}>
//       <Leaf l={8} b={44} w={30} h={96} r={-26} c="#4fb04a"/><Leaf l={34} b={44} w={32} h={112} r={-2} c="#2f9a6a"/><Leaf l={60} b={44} w={30} h={90} r={24} c="#5fc24a"/>
//       <View style={{position:'absolute',left:14,bottom:0,width:74,height:60,borderRadius:8,backgroundColor:'#d9825b',borderTopWidth:8,borderTopColor:'#e89a72'}}/></Animated.View>
//     {/* chalkboard (right) */}
//     <View style={{position:'absolute',right:-16,bottom:150,width:86,height:122,backgroundColor:'#2f5a55',borderWidth:5,borderColor:'#d9a050',borderRadius:4,paddingLeft:10,paddingTop:8}}>
//       {['Small','Steps','Big','Dreams'].map(t=><Text key={t} style={ws.chalk}>{t}</Text>)}
//       <Text style={[ws.chalk,{color:'#ff9ec0',fontSize:14}]}>♡</Text></View>
//     <View style={{position:'absolute',right:6,bottom:100,width:6,height:52,backgroundColor:'#c98d4d'}}/>
//     {/* desk */}
//     <View style={{position:'absolute',left:0,right:0,bottom:0,height:100,backgroundColor:'#e9a96a',borderTopWidth:6,borderTopColor:'#f6c58a'}}>
//       {[18,42,68].map((t,i)=><View key={i} style={{position:'absolute',left:0,right:0,top:t,height:2,backgroundColor:'rgba(150,80,30,0.18)'}}/>)}
//     </View>
//     <View style={{position:'absolute',left:W*0.46,bottom:18}}><Star w={28} on/></View>
//     <View style={{position:'absolute',left:W*0.74,bottom:8,transform:[{rotate:'14deg'}]}}><Star w={30} on/></View>
//   </View>}
// const ws=StyleSheet.create({
//   eye:{width:7,height:11,borderRadius:4,backgroundColor:'#5b3a29'},
//   cheek:{position:'absolute',width:14,height:9,borderRadius:7,backgroundColor:'#ff9a8a'},
//   chalk:{fontFamily:F,fontSize:13,fontWeight:'bold',color:'#e9f3e6',lineHeight:17}});

// export default function BTCongratsScreen({n,hints,playerId,stats,hasNext,onNext,onHome}:any){
//   const sw=useStageW(),{height:H}=useWindowDimensions();
//   const k=Math.max(0.6,Math.min(1,(H-360)/420));            // shrink on small phones
//   const cardW=Math.round(Math.min(sw*0.78,340)),signW=Math.round(cardW*0.9),
//     signFs=Math.round(24+6*k),cheer=CHEERS[(n-1)%CHEERS.length],bs=Math.round(17*Math.max(0.88,k));

//   // ---- frontend -> backend -> DB ----
//   const[res,setRes]=useState<any>(null),[saveErr,setSaveErr]=useState(false),saved=useRef(false);
//   useEffect(()=>{if(saved.current)return;saved.current=true;
//     progress.complete({playerId,level:n,attempts:stats?.tries??1,hintsUsed:stats?.hints??0,skipped:!!stats?.skipped})
//       .then(setRes).catch(()=>setSaveErr(true))},[]);
//   const earned=res?.stars??localStars(stats?.tries??1,stats?.hints??0,!!stats?.skipped);

//   const card=useRef(new Animated.Value(0)).current,rib=useRef(new Animated.Value(0)).current,stars=useRef([0,1,2].map(()=>new Animated.Value(0))).current,
//     bub=useRef(new Animated.Value(0)).current,pop=useRef(new Animated.Value(0)).current,btn=useRef(new Animated.Value(0)).current,
//     bounce=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{
//     Animated.sequence([
//       Animated.spring(card,{toValue:1,friction:6,tension:80,useNativeDriver:true}),
//       Animated.spring(rib,{toValue:1,friction:5,tension:90,useNativeDriver:true}),
//       Animated.stagger(160,stars.map(v=>Animated.spring(v,{toValue:1,friction:3,tension:90,useNativeDriver:true}))),
//       Animated.parallel([Animated.spring(bub,{toValue:1,friction:5,tension:70,useNativeDriver:true}),Animated.spring(pop,{toValue:1,friction:4,tension:80,useNativeDriver:true})]),
//       Animated.spring(btn,{toValue:1,friction:5,tension:70,useNativeDriver:true})]).start();
//     loop(bounce,650);loop(pulse,800);
//   },[]);
//   const cardS=card.interpolate({inputRange:[0,1],outputRange:[0.7,1]}),ribY=rib.interpolate({inputRange:[0,1],outputRange:[-60,0]});
//   const starAnim=(v:Animated.Value)=>({opacity:v,transform:[{scale:v},{rotate:v.interpolate({inputRange:[0,1],outputRange:['-60deg','0deg']})}]});
//   const bubS=bub.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),popS=pop.interpolate({inputRange:[0,1],outputRange:[0.2,1]}),
//     btnS=btn.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.06]}),
//     midS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.1]}),bY=bounce.interpolate({inputRange:[0,1],outputRange:[0,-10]}),
//     bR=bounce.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}),dashO=pulse.interpolate({inputRange:[0,1],outputRange:[0.5,1]});
//   const sizes=[Math.round(60*k),Math.round(80*k),Math.round(60*k)];
//   const brainW=Math.round(150*k);

//   return <Stage bg="#4aa6ee"><View style={wn.root}>
//     <SkyBg W={sw} H={H}/>

//     {/* top bar */}
//     <View style={wn.head}>
//       <TouchableOpacity onPress={onHome} style={wn.round}><Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#7a4118"/></Svg></TouchableOpacity>
//       <View style={{flex:1}}/>
//       <View style={wn.pill}><Text style={wn.pn}>{hints}</Text><Text style={{fontSize:20}}>💡</Text></View>
//     </View>

//     {/* card */}
//     <View style={wn.center}>
//       <Animated.View style={[wn.card,{width:cardW,opacity:card,transform:[{scale:cardS}]}]}>

//         {/* wooden sign */}
//         <Animated.View style={[wn.signWrap,{width:signW,marginLeft:-signW/2,opacity:rib,transform:[{translateY:ribY}]}]}>
//           <View style={wn.sign}>
//             <View style={[wn.leaf,{left:-12,transform:[{rotate:'-38deg'}]}]}/><View style={[wn.leaf,{left:-2,top:-20,transform:[{rotate:'-8deg'}]}]}/>
//             <View style={[wn.leaf,{right:-12,transform:[{rotate:'38deg'}]}]}/><View style={[wn.leaf,{right:-2,top:-20,transform:[{rotate:'8deg'}]}]}/>
//             <Text numberOfLines={1} adjustsFontSizeToFit style={[wn.s1,{fontSize:signFs}]}>{'LEVEL '+n}</Text>
//             <Text numberOfLines={1} adjustsFontSizeToFit style={[wn.s2,{fontSize:Math.round(signFs*1.25)}]}>COMPLETE!</Text>
//           </View>
//         </Animated.View>

//         {/* stars */}
//         <View style={wn.starRow}>
//           <View style={wn.sd}><View style={[wn.dash,{backgroundColor:'#8e5be0',transform:[{rotate:'40deg'}]}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c'}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c',transform:[{rotate:'-40deg'}]}]}/></View>
//           {[0,1,2].map(i=>{const mid=i===1;
//             const core=<Star w={sizes[i]} on={i<earned}/>;
//             return <Animated.View key={i} style={[{marginHorizontal:mid?4:0,marginBottom:mid?0:2},starAnim(stars[i])]}>
//               {mid?<Animated.View style={{transform:[{scale:midS}]}}>{core}</Animated.View>:core}</Animated.View>})}
//           <View style={wn.sd}><View style={[wn.dash,{backgroundColor:'#8e5be0',transform:[{rotate:'-40deg'}]}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c'}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c',transform:[{rotate:'40deg'}]}]}/></View>
//         </View>

//         {/* speech bubble */}
//         <Animated.View style={{alignItems:'center',opacity:bub,transform:[{scale:bubS}]}}>
//           <View style={wn.bubble}>
//             <Text style={[wn.b1,{fontSize:bs}]}>{cheer.a}</Text>
//             <Text style={[wn.b2,{fontSize:bs}]}>{cheer.b}</Text>
//             <View style={{position:'absolute',right:12,top:8}}><Smiley w={20}/></View>
//           </View>
//           <View style={{marginTop:-3,alignSelf:'flex-end',marginRight:46}}>
//             <Svg width={26} height={20} viewBox="0 0 34 26"><Polygon points="0,0 34,0 8,26" fill="#e4dbfb"/><Path d="M0 0 L8 26 L34 0" stroke="#b9a8ee" strokeWidth="2.5" fill="none"/></Svg>
//           </View>
//         </Animated.View>

//         {/* brain hero */}
//         <View style={{alignItems:'center',justifyContent:'center',height:Math.round(150*k),width:'100%'}}>
//           <Animated.View style={{position:'absolute',left:'6%',opacity:Animated.multiply(pop,dashO)}}>
//             <View style={[wn.sp,{transform:[{rotate:'40deg'}]}]}/><View style={[wn.sp,{marginLeft:-8}]}/><View style={[wn.sp,{transform:[{rotate:'-40deg'}]}]}/></Animated.View>
//           <Animated.View style={{position:'absolute',right:'6%',opacity:Animated.multiply(pop,dashO)}}>
//             <View style={[wn.sp,{transform:[{rotate:'-40deg'}]}]}/><View style={[wn.sp,{marginLeft:8}]}/><View style={[wn.sp,{transform:[{rotate:'40deg'}]}]}/></Animated.View>
//           <Animated.View style={{opacity:pop,transform:[{translateY:bY},{rotate:bR},{scale:popS}]}}><BrainHero w={brainW}/></Animated.View>
//         </View>

//         {/* footer */}
//         <Text style={[wn.saved,{color:saveErr?'#c0392b':res?'#2f8a3a':'#9a8a6a'}]}>{saveErr?'Offline - progress not saved':res?'Progress saved ✓':'Saving progress...'}</Text>
//         <Animated.View style={{opacity:btn,transform:[{scale:btnS}]}}>
//           <Animated.View style={{transform:[{scale:pulseS}]}}>
//             <TouchableOpacity activeOpacity={0.85} onPress={onNext} style={wn.btn}>
//               <View style={wn.stitch}/>
//               <View style={wn.btnShine}/>
//               <Text style={wn.btnt}>{hasNext?'NEXT':'DONE'}</Text>
//               <Svg width={30} height={30} viewBox="0 0 24 24" style={{marginLeft:8}}>
//                 <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke="#1f7a22" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//                 <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//               </Svg>
//             </TouchableOpacity>
//           </Animated.View>
//         </Animated.View>
//       </Animated.View>
//     </View>

//     {/* books (left) + pencil cup (right) on the desk */}
//     <View pointerEvents="none" style={wn.books}>
//       {[['Think','#9b4fc0',128],['Learn','#2f7fd0',116],['Grow','#f09a28',122]].map(([t,c,w]:any,i)=>
//         <View key={t} style={[wn.book,{backgroundColor:c,width:w,marginLeft:i===1?8:i===2?-4:0}]}><Text style={wn.bookt}>{t}</Text></View>)}
//     </View>
//     <View pointerEvents="none" style={wn.cup}>
//       <View style={[wn.pen,{backgroundColor:'#5fae3a',left:8,height:40,transform:[{rotate:'-10deg'}]}]}/>
//       <View style={[wn.pen,{backgroundColor:'#ee6aa0',left:22,height:48}]}/>
//       <View style={[wn.pen,{backgroundColor:'#3b8fe8',left:36,height:42,transform:[{rotate:'10deg'}]}]}/>
//       <View style={wn.cupBody}><Smiley w={26}/></View>
//     </View>
//     <Confetti/>
//   </View></Stage>}

// const wn=StyleSheet.create({
//   root:{flex:1,backgroundColor:'#4aa6ee',paddingTop:30,overflow:'hidden'},
//   head:{flexDirection:'row',alignItems:'center',paddingHorizontal:14,marginTop:6},
//   round:{width:46,height:46,borderRadius:23,backgroundColor:'#ffc928',borderWidth:3,borderColor:'#f0a010',alignItems:'center',justifyContent:'center',elevation:5},
//   pill:{flexDirection:'row',alignItems:'center',gap:4,borderRadius:22,paddingHorizontal:14,backgroundColor:'#fff',height:40,borderWidth:2,borderColor:'#d6c8f5',elevation:5},
//   pn:{fontFamily:F,fontSize:22,fontWeight:'900',color:NAVY},
//   center:{flex:1,alignItems:'center',justifyContent:'center',paddingBottom:100,paddingTop:34},
//   card:{backgroundColor:'#fbf3de',borderWidth:6,borderColor:'#f7c948',borderRadius:34,paddingTop:62,paddingBottom:16,paddingHorizontal:10,alignItems:'center',elevation:8,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:8,shadowOffset:{width:0,height:4}},
//   signWrap:{position:'absolute',top:-50,left:'50%',alignItems:'center',zIndex:5},
//   sign:{width:'100%',backgroundColor:'#a85f26',borderWidth:4,borderColor:'#7a4118',borderRadius:18,paddingHorizontal:16,paddingTop:4,paddingBottom:8,alignItems:'center',elevation:6},
//   leaf:{position:'absolute',top:-12,width:18,height:30,borderRadius:15,backgroundColor:'#5fae3a',borderWidth:2,borderColor:'#3f8a2a'},
//   s1:{fontFamily:F,fontWeight:'900',color:'#fff',textShadowColor:'#5a2f10',textShadowRadius:3,textShadowOffset:{width:1,height:2}},
//   s2:{fontFamily:F,fontWeight:'900',color:'#ffd83a',marginTop:-4,textShadowColor:'#8a4a10',textShadowRadius:3,textShadowOffset:{width:1,height:2}},
//   starRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'center',marginTop:2,marginBottom:6},
//   sd:{width:26,height:50,alignItems:'center',justifyContent:'center',gap:4},
//   dash:{width:16,height:4,borderRadius:2},
//   bubble:{backgroundColor:'#e4dbfb',borderWidth:2.5,borderColor:'#b9a8ee',borderRadius:28,paddingHorizontal:20,paddingVertical:10,maxWidth:300},
//   b1:{fontFamily:F,fontWeight:'900',color:NAVY},
//   b2:{fontFamily:F,fontWeight:'900',color:'#7a2fd0'},
//   sp:{width:20,height:5,borderRadius:3,backgroundColor:'#ffc72c',marginVertical:6},
//   saved:{fontFamily:F,fontSize:12,fontWeight:'bold',marginBottom:6,marginTop:2},
//   btn:{minWidth:210,height:60,borderRadius:30,backgroundColor:'#5fcf3a',borderWidth:4,borderColor:'#2f9a2a',flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:28,overflow:'hidden',elevation:6},
//   stitch:{position:'absolute',left:5,right:5,top:5,bottom:5,borderRadius:26,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)'},
//   btnShine:{position:'absolute',top:6,left:22,right:22,height:10,borderRadius:5,backgroundColor:'rgba(255,255,255,0.35)'},
//   btnt:{fontFamily:F,fontSize:30,fontWeight:'900',color:'#fff',textShadowColor:'#1f7a22',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
//   books:{position:'absolute',left:0,bottom:8},
//   book:{height:32,borderRadius:5,justifyContent:'center',paddingHorizontal:14,marginTop:1,borderBottomWidth:3,borderBottomColor:'rgba(0,0,0,0.25)',borderTopWidth:3,borderTopColor:'rgba(255,255,255,0.3)'},
//   bookt:{fontFamily:F,fontSize:15,fontWeight:'900',color:'#fff'},
//   cup:{position:'absolute',right:10,bottom:6,width:68,height:96},
//   pen:{position:'absolute',top:0,width:10,borderRadius:3,borderTopLeftRadius:5,borderTopRightRadius:5},
//   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:54,backgroundColor:'#f7c928',borderRadius:8,borderWidth:2.5,borderColor:'#e0a81f',alignItems:'center',justifyContent:'center'}});
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,Easing,StyleSheet,useWindowDimensions} from 'react-native';
import Svg,{Rect,Path,Circle,Polygon,Line,Ellipse} from 'react-native-svg';
import {F,INK,Stage,Smiley,Confetti,loop,useStageW} from './BTShared';
import * as progress from './progressApi';

const NAVY='#10245e';

// same formula as backend (used only if the server can't be reached)
const localStars=(tries:number,hints:number,skipped:boolean)=>skipped?1:Math.max(1,(tries<=1?3:tries===2?2:1)-(hints>0?1:0));

// local ping-pong loop (native driver) used by the background animations
const yoyo=(v:Animated.Value,ms:number)=>Animated.loop(Animated.sequence([
  Animated.timing(v,{toValue:1,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
  Animated.timing(v,{toValue:0,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true})])).start();

const BrainHero=({w}:any)=><Svg width={w} height={w*0.95} viewBox="0 0 200 190">
  <Ellipse cx="100" cy="184" rx="62" ry="6" fill="#d9cdf0"/>
  <Line x1="86" y1="148" x2="84" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
  <Line x1="114" y1="148" x2="116" y2="170" stroke="#1c2b4a" strokeWidth="6" strokeLinecap="round"/>
  <Ellipse cx="80" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
  <Ellipse cx="120" cy="176" rx="16" ry="9" fill="#3b6fd4" stroke="#1c2b4a" strokeWidth="3"/>
  <Path d="M70 174 H90 M110 174 H130" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
  <Path d="M52 112 Q36 106 30 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
  <Path d="M148 112 Q164 106 170 90" stroke="#1c2b4a" strokeWidth="6" fill="none" strokeLinecap="round"/>
  <Rect x="16" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
  <Rect x="22" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
  <Rect x="158" y="78" width="26" height="22" rx="10" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
  <Rect x="169" y="60" width="9" height="22" rx="4.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
  {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
    <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
  {[[62,62,30],[100,46,32],[138,62,30],[48,100,28],[152,100,28],[100,92,46],[70,128,28],[130,128,28]].map(([x,y,r]:any,i)=>
    <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
  <Path d="M78 52 Q90 62 82 74 M120 50 Q110 62 120 72 M58 92 Q70 98 64 110 M144 92 Q132 100 138 112" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
  <Circle cx="62" cy="116" r="8" fill="#ff7a96" opacity="0.7"/><Circle cx="138" cy="116" r="8" fill="#ff7a96" opacity="0.7"/>
  <Circle cx="80" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
  <Circle cx="120" cy="98" r="19" fill="#fff" fillOpacity="0.25" stroke="#1c2b4a" strokeWidth="5"/>
  <Path d="M99 96 Q100 92 101 96" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
  <Path d="M70 100 Q80 88 90 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
  <Path d="M110 100 Q120 88 130 100" stroke="#1c2b4a" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
  <Path d="M88 122 Q100 142 112 122 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
  <Path d="M93 130 Q100 137 107 130 Q100 126 93 130Z" fill="#ff8aa0"/>
</Svg>;

const Star=({w,on}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
  <Polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill={on?'#ffc72c':'#e3dccb'} stroke={on?'#9a5a1f':'#9a937f'} strokeWidth="5" strokeLinejoin="round"/>
  {on&&<><Polygon points="50,20 58,40 78,42 62,54 67,74 50,62 33,74 38,54 22,42 42,40" fill="#ffe07a"/><Path d="M40 30 L46 24" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></>}</Svg>;

const Rocket=()=><Svg width={64} height={96} viewBox="0 0 64 96">
  <Path d="M32 96 C22 84 26 74 32 66 C38 74 42 84 32 96Z" fill="#ff9a2e"/>
  <Path d="M32 90 C27 82 29 76 32 72 C35 76 37 82 32 90Z" fill="#ffd93a"/>
  <Path d="M14 56 L2 76 L18 68Z" fill="#ef4b4b"/><Path d="M50 56 L62 76 L46 68Z" fill="#ef4b4b"/>
  <Path d="M32 4 C48 18 48 50 44 68 H20 C16 50 16 18 32 4Z" fill="#fff" stroke="#d9e2f2" strokeWidth="2"/>
  <Path d="M32 4 C40 11 44 20 45 28 H19 C20 20 24 11 32 4Z" fill="#ef4b4b"/>
  <Circle cx="32" cy="44" r="9" fill="#3b8fe8" stroke="#1c4a9a" strokeWidth="3"/></Svg>;

const CHEERS=[
  {a:'Math is easy...',b:'when you add a little confidence!'},
  {a:'Great job!',b:'Your brain is on fire!'},
  {a:'Smart move...',b:'you are getting sharper!'},
  {a:'Nice one!',b:'Keep that streak going!'},
  {a:'Wow...',b:'that was a tricky one!'}];

/* ---------- animated background pieces ---------- */
const Leaf=({l,b,w,h,r,c}:any)=><View style={{position:'absolute',left:l,bottom:b,width:w,height:h,borderRadius:h/2,backgroundColor:c||'#5fae3a',transform:[{rotate:r+'deg'}]}}/>;
const Tree=({l,b,s}:any)=><View style={{position:'absolute',left:l,bottom:b,alignItems:'center'}}>
  <View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#4fb04a'}}/><View style={{position:'absolute',left:s*0.35,top:-s*0.25,width:s*0.7,height:s*0.7,borderRadius:s*0.35,backgroundColor:'#62c24a'}}/>
  <View style={{width:s*0.16,height:s*0.4,backgroundColor:'#8a5a2a',marginTop:-2}}/></View>;

// init = starting point (0..1) so clouds are already visible when the screen opens
const DriftCloud=({W,top,scale,ms,init}:any)=>{
  const p=useRef(new Animated.Value(init)).current;
  useEffect(()=>{Animated.sequence([
    Animated.timing(p,{toValue:1,duration:Math.max(1,ms*(1-init)),easing:Easing.linear,useNativeDriver:true}),
    Animated.loop(Animated.timing(p,{toValue:1,duration:ms,easing:Easing.linear,useNativeDriver:true}))]).start()},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',top,transform:[{translateX:p.interpolate({inputRange:[0,1],outputRange:[-200,W+200]})},{scale}]}}>
    <View style={{width:130,height:34,borderRadius:17,backgroundColor:'rgba(255,255,255,0.95)'}}/>
    <View style={{position:'absolute',left:14,top:-18,width:46,height:46,borderRadius:23,backgroundColor:'rgba(255,255,255,0.95)'}}/>
    <View style={{position:'absolute',left:46,top:-30,width:62,height:62,borderRadius:31,backgroundColor:'rgba(255,255,255,0.95)'}}/>
    <View style={{position:'absolute',left:88,top:-14,width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,0.95)'}}/></Animated.View>};

const Twinkle=({x,y,w,delay}:any)=>{
  const p=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.loop(Animated.sequence([
    Animated.timing(p,{toValue:1,duration:900,useNativeDriver:true}),Animated.timing(p,{toValue:0,duration:900,useNativeDriver:true})]))]).start()},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',left:x,top:y,opacity:p.interpolate({inputRange:[0,1],outputRange:[0.55,1]}),
    transform:[{scale:p.interpolate({inputRange:[0,1],outputRange:[0.85,1.15]})},{rotate:p.interpolate({inputRange:[0,1],outputRange:['-12deg','12deg']})}]}}><Star w={w} on/></Animated.View>};

/* The scene is drawn at FULL window width (W). Things that belong near the card are
   placed relative to the phone-sized column (cx = column left, cw = column width).
   On mobile cx=0 and cw=W, so it looks exactly like a normal phone screen. */
function SkyBg({W,H,cx,cw,wide,deskH}:any){
  const pl=useRef(new Animated.Value(0)).current,rk=useRef(new Animated.Value(0)).current,sn=useRef(new Animated.Value(0)).current,sp=useRef(new Animated.Value(0)).current;
  useEffect(()=>{yoyo(pl,2800);yoyo(rk,1700);yoyo(sn,1600);
    Animated.loop(Animated.timing(sp,{toValue:1,duration:22000,easing:Easing.linear,useNativeDriver:true})).start()},[]);
  const spinR=sp.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']}),
    sunS=sn.interpolate({inputRange:[0,1],outputRange:[1,1.07]}),
    plantR=pl.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}),
    rkY=rk.interpolate({inputRange:[0,1],outputRange:[0,-12]}),
    rkX=rk.interpolate({inputRange:[0,1],outputRange:[0,8]});
  const R=cx+cw,X=(f:number)=>cx+cw*f;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {/* sky layers */}
    <View style={{position:'absolute',left:0,right:0,top:0,height:'40%',backgroundColor:'#4aa6ee'}}/>
    <View style={{position:'absolute',left:0,right:0,top:'40%',height:'30%',backgroundColor:'#7cc8f6'}}/>
    <View style={{position:'absolute',left:0,right:0,top:'70%',bottom:0,backgroundColor:'#a8defa'}}/>
    <DriftCloud W={W} top={H*0.06} scale={1.1} ms={32000} init={0.3}/>
    <DriftCloud W={W} top={H*0.34} scale={0.8} ms={40000} init={0.65}/>
    <DriftCloud W={W} top={H*0.58} scale={0.9} ms={36000} init={0.1}/>
    {wide&&<><DriftCloud W={W} top={H*0.18} scale={0.9} ms={44000} init={0.85}/><DriftCloud W={W} top={H*0.46} scale={1.1} ms={48000} init={0.45}/></>}
    {/* sun with face (right edge of the column) */}
    <View style={{position:'absolute',left:R-92,top:H*0.2,width:130,height:130,alignItems:'center',justifyContent:'center'}}>
      <Animated.View style={{position:'absolute',width:170,height:170,transform:[{rotate:spinR}]}}>
        {Array.from({length:10}).map((_,i)=><View key={i} style={{position:'absolute',width:170,height:170,transform:[{rotate:(i*36)+'deg'}]}}>
          <View style={{position:'absolute',left:74,top:0,width:22,height:32,borderRadius:11,backgroundColor:'#ffd93a'}}/></View>)}
      </Animated.View>
      <Animated.View style={{transform:[{scale:sunS}]}}>
        <View style={{width:112,height:112,borderRadius:56,backgroundColor:'#ffd93a',borderWidth:3,borderColor:'#ffe98a',alignItems:'center',paddingTop:34}}>
          <View style={{flexDirection:'row',gap:20}}><View style={ws.eye}/><View style={ws.eye}/></View>
          <View style={{width:22,height:11,marginTop:6,borderBottomLeftRadius:11,borderBottomRightRadius:11,borderWidth:3,borderTopWidth:0,borderColor:'#8a4a1a'}}/>
          <View style={[ws.cheek,{left:14,top:56}]}/><View style={[ws.cheek,{right:14,top:56}]}/>
        </View>
      </Animated.View>
    </View>
    {/* rocket */}
    <Animated.View style={{position:'absolute',left:cx+8,top:H*0.14,transform:[{translateY:rkY},{translateX:rkX},{rotate:'32deg'}]}}><Rocket/></Animated.View>
    {/* floating stars */}
    <Twinkle x={X(0.22)} y={H*0.03} w={34} delay={0}/>
    <Twinkle x={X(0.62)} y={H*0.07} w={30} delay={500}/>
    <Twinkle x={X(0.04)} y={H*0.36} w={34} delay={900}/>
    <Twinkle x={X(0.9)} y={H*0.4} w={30} delay={300}/>
    {wide&&<><Twinkle x={cx-120} y={H*0.22} w={28} delay={200}/><Twinkle x={R+90} y={H*0.12} w={30} delay={700}/><Twinkle x={cx-220} y={H*0.5} w={24} delay={1100}/><Twinkle x={R+200} y={H*0.45} w={26} delay={400}/></>}
    {/* meadow: full-width base band, rolling hills, extra scenery on the sides */}
    <View style={{position:'absolute',left:0,right:0,bottom:deskH-4,height:46,backgroundColor:'#74c843'}}/>
    <View style={{position:'absolute',left:cx-70,bottom:deskH-8,width:300,height:170,borderRadius:150,backgroundColor:'#7ccf6e'}}/>
    <View style={{position:'absolute',left:R-250,bottom:deskH-8,width:320,height:140,borderRadius:160,backgroundColor:'#6fc2a4'}}/>
    {wide&&<>
      <View style={{position:'absolute',left:cx-430,bottom:deskH-8,width:420,height:200,borderRadius:210,backgroundColor:'#7ccf6e'}}/>
      <View style={{position:'absolute',left:R+10,bottom:deskH-8,width:440,height:180,borderRadius:220,backgroundColor:'#6fc2a4'}}/>
      <Tree l={cx-140} b={deskH+10} s={44}/><Tree l={cx-300} b={deskH+6} s={38}/><Tree l={R+110} b={deskH+10} s={46}/><Tree l={R+280} b={deskH+6} s={40}/></>}
    {[[X(0.08),deskH+60],[X(0.16),deskH+80],[X(0.25),deskH+56]].map((f:any,i)=><View key={i} style={{position:'absolute',left:f[0],bottom:f[1],width:14,height:14,borderRadius:7,backgroundColor:i===1?'#e58fd0':'#c9a1ef'}}/>)}
    {/* plant (left of the column) */}
    <Animated.View style={{position:'absolute',left:cx-8,bottom:deskH-6,width:110,height:150,transform:[{rotate:plantR}]}}>
      <Leaf l={8} b={44} w={30} h={96} r={-26} c="#4fb04a"/><Leaf l={34} b={44} w={32} h={112} r={-2} c="#2f9a6a"/><Leaf l={60} b={44} w={30} h={90} r={24} c="#5fc24a"/>
      <View style={{position:'absolute',left:14,bottom:0,width:74,height:60,borderRadius:8,backgroundColor:'#d9825b',borderTopWidth:8,borderTopColor:'#e89a72'}}/></Animated.View>
    {/* desk: full width so the sides are never plain blue */}
    <View style={{position:'absolute',left:0,right:0,bottom:0,height:deskH,backgroundColor:'#e9a96a',borderTopWidth:6,borderTopColor:'#f6c58a'}}>
      {[16,38,60].map((t,i)=><View key={i} style={{position:'absolute',left:0,right:0,top:t,height:2,backgroundColor:'rgba(150,80,30,0.18)'}}/>)}
    </View>
    {/* chalkboard standing on the desk, between the books and the pencil cup (always fully visible) */}
    {cw>=340&&<View style={{position:'absolute',left:cx+Math.round(cw*0.4),bottom:deskH-8,width:88,height:64,backgroundColor:'#2f5a55',borderWidth:4,borderColor:'#d9a050',borderRadius:4,alignItems:'center',justifyContent:'center'}}>
      <Text allowFontScaling={false} style={ws.chalk}>Small Steps</Text><Text allowFontScaling={false} style={ws.chalk}>Big Dreams</Text><Text allowFontScaling={false} style={[ws.chalk,{color:'#ff9ec0'}]}>♡</Text></View>}
  </View>}
const ws=StyleSheet.create({
  eye:{width:7,height:11,borderRadius:4,backgroundColor:'#5b3a29'},
  cheek:{position:'absolute',width:14,height:9,borderRadius:7,backgroundColor:'#ff9a8a'},
  chalk:{fontFamily:F,fontSize:11,fontWeight:'bold',color:'#e9f3e6',lineHeight:14}});

export default function BTCongratsScreen({n,hints,playerId,stats,hasNext,onNext,onHome}:any){
  const sw=useStageW(),{width:ww,height:H}=useWindowDimensions();
  const wide=ww>sw+8,W=wide?ww:sw,cx=wide?Math.round((ww-sw)/2):0;       // website: scene is wider than the phone-sized column

  // ---------- layout: card sits BETWEEN the top bar and the desk, nothing overlaps ----------
  const compact=H<700,deskH=compact?64:84,bookH=compact?26:30,stackH=3*(bookH+1);
  const reserve=Math.max(deskH,stackH+6,104)+8;                          // space kept free at the bottom (desk + books + cup)
  const topMin=compact?138:146;                                          // sign (50px above the card) stays under the top bar
  const avail=Math.max(300,H-reserve-topMin),cardH=Math.min(avail,600),cardTop=topMin+Math.round((avail-cardH)/2);
  const k=Math.max(0.6,Math.min(1,(cardH-340)/150));                     // shrink contents on short screens
  const cardW=Math.round(Math.min(sw*0.8,340)),signW=Math.round(Math.min(cardW*0.92,300));
  const s2Fs=Math.floor(Math.min(36,(signW-44)/6.4)),s1Fs=Math.floor(s2Fs*0.78);
  const cheer=CHEERS[(n-1)%CHEERS.length],bs=Math.round(16*Math.max(0.9,k));
  const sizes=[Math.round(58*k),Math.round(78*k),Math.round(58*k)],brainW=Math.min(Math.round(150*k),Math.round(cardW*0.5)),btnH=Math.round(52+8*k);

  // ---- frontend -> backend -> DB (saved silently, no text on screen) ----
  const[res,setRes]=useState<any>(null),saved=useRef(false);
  useEffect(()=>{if(saved.current)return;saved.current=true;
    progress.complete({playerId,level:n,attempts:stats?.tries??1,hintsUsed:stats?.hints??0,skipped:!!stats?.skipped})
      .then(setRes).catch(()=>{})},[]);
  const earned=res?.stars??localStars(stats?.tries??1,stats?.hints??0,!!stats?.skipped);

  const card=useRef(new Animated.Value(0)).current,rib=useRef(new Animated.Value(0)).current,stars=useRef([0,1,2].map(()=>new Animated.Value(0))).current,
    bub=useRef(new Animated.Value(0)).current,pop=useRef(new Animated.Value(0)).current,btn=useRef(new Animated.Value(0)).current,
    bounce=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.sequence([
      Animated.spring(card,{toValue:1,friction:6,tension:80,useNativeDriver:true}),
      Animated.spring(rib,{toValue:1,friction:5,tension:90,useNativeDriver:true}),
      Animated.stagger(160,stars.map(v=>Animated.spring(v,{toValue:1,friction:3,tension:90,useNativeDriver:true}))),
      Animated.parallel([Animated.spring(bub,{toValue:1,friction:5,tension:70,useNativeDriver:true}),Animated.spring(pop,{toValue:1,friction:4,tension:80,useNativeDriver:true})]),
      Animated.spring(btn,{toValue:1,friction:5,tension:70,useNativeDriver:true})]).start();
    loop(bounce,650);loop(pulse,800);
  },[]);
  const cardS=card.interpolate({inputRange:[0,1],outputRange:[0.7,1]}),ribY=rib.interpolate({inputRange:[0,1],outputRange:[-60,0]});
  const starAnim=(v:Animated.Value)=>({opacity:v,transform:[{scale:v},{rotate:v.interpolate({inputRange:[0,1],outputRange:['-60deg','0deg']})}]});
  const bubS=bub.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),popS=pop.interpolate({inputRange:[0,1],outputRange:[0.2,1]}),
    btnS=btn.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.06]}),
    midS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.1]}),bY=bounce.interpolate({inputRange:[0,1],outputRange:[0,-10]}),
    bR=bounce.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}),dashO=pulse.interpolate({inputRange:[0,1],outputRange:[0.5,1]});

  return <View style={{flex:1,backgroundColor:'#4aa6ee'}}>
    {/* full-window animated scene (sits behind the phone-sized column) */}
    <SkyBg W={W} H={H} cx={cx} cw={sw} wide={wide} deskH={deskH}/>

    <Stage bg="transparent"><View style={wn.root}>

      {/* top bar */}
      <View style={wn.head}>
        <TouchableOpacity onPress={onHome} style={wn.round}><Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#7a4118"/></Svg></TouchableOpacity>
        <View style={{flex:1}}/>
        <View style={wn.pill}><Text style={wn.pn}>{hints}</Text><Text style={{fontSize:20}}>💡</Text></View>
      </View>

      {/* card */}
      <Animated.View style={[wn.card,{left:Math.round((sw-cardW)/2),top:cardTop,width:cardW,height:cardH,opacity:card,transform:[{scale:cardS}]}]}>

        {/* wooden sign */}
        <Animated.View style={[wn.signWrap,{width:signW,marginLeft:-signW/2,opacity:rib,transform:[{translateY:ribY}]}]}>
          <View style={wn.sign}>
            <View style={[wn.leaf,{left:-12,transform:[{rotate:'-38deg'}]}]}/><View style={[wn.leaf,{left:-2,top:-20,transform:[{rotate:'-8deg'}]}]}/>
            <View style={[wn.leaf,{right:-12,transform:[{rotate:'38deg'}]}]}/><View style={[wn.leaf,{right:-2,top:-20,transform:[{rotate:'8deg'}]}]}/>
            <Text allowFontScaling={false} style={[wn.s1,{fontSize:s1Fs}]}>{'LEVEL '+n}</Text>
            <Text allowFontScaling={false} style={[wn.s2,{fontSize:s2Fs}]}>COMPLETE!</Text>
          </View>
        </Animated.View>

        {/* contents spread evenly inside the card so nothing overflows */}
        <View style={wn.inner}>
          {/* stars */}
          <View style={wn.starRow}>
            <View style={wn.sd}><View style={[wn.dash,{backgroundColor:'#8e5be0',transform:[{rotate:'40deg'}]}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c'}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c',transform:[{rotate:'-40deg'}]}]}/></View>
            {[0,1,2].map(i=>{const mid=i===1;
              const core=<Star w={sizes[i]} on={i<earned}/>;
              return <Animated.View key={i} style={[{marginHorizontal:mid?4:0,marginBottom:mid?0:2},starAnim(stars[i])]}>
                {mid?<Animated.View style={{transform:[{scale:midS}]}}>{core}</Animated.View>:core}</Animated.View>})}
            <View style={wn.sd}><View style={[wn.dash,{backgroundColor:'#8e5be0',transform:[{rotate:'-40deg'}]}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c'}]}/><View style={[wn.dash,{backgroundColor:'#ffc72c',transform:[{rotate:'40deg'}]}]}/></View>
          </View>

          {/* speech bubble */}
          <Animated.View style={{alignItems:'center',opacity:bub,transform:[{scale:bubS}]}}>
            <View style={[wn.bubble,{maxWidth:cardW-30}]}>
              <Text style={[wn.b1,{fontSize:bs}]}>{cheer.a}</Text>
              <Text style={[wn.b2,{fontSize:bs}]}>{cheer.b}</Text>
              <View style={{position:'absolute',right:12,top:8}}><Smiley w={18}/></View>
            </View>
            <View style={{marginTop:-3,alignSelf:'flex-end',marginRight:46}}>
              <Svg width={24} height={18} viewBox="0 0 34 26"><Polygon points="0,0 34,0 8,26" fill="#e4dbfb"/><Path d="M0 0 L8 26 L34 0" stroke="#b9a8ee" strokeWidth="2.5" fill="none"/></Svg>
            </View>
          </Animated.View>

          {/* brain hero */}
          <View style={{alignItems:'center',justifyContent:'center',height:Math.round(brainW*0.98),width:'100%'}}>
            <Animated.View style={{position:'absolute',left:'6%',opacity:Animated.multiply(pop,dashO)}}>
              <View style={[wn.sp,{transform:[{rotate:'40deg'}]}]}/><View style={[wn.sp,{marginLeft:-8}]}/><View style={[wn.sp,{transform:[{rotate:'-40deg'}]}]}/></Animated.View>
            <Animated.View style={{position:'absolute',right:'6%',opacity:Animated.multiply(pop,dashO)}}>
              <View style={[wn.sp,{transform:[{rotate:'-40deg'}]}]}/><View style={[wn.sp,{marginLeft:8}]}/><View style={[wn.sp,{transform:[{rotate:'40deg'}]}]}/></Animated.View>
            <Animated.View style={{opacity:pop,transform:[{translateY:bY},{rotate:bR},{scale:popS}]}}><BrainHero w={brainW}/></Animated.View>
          </View>

          {/* NEXT */}
          <Animated.View style={{opacity:btn,transform:[{scale:btnS}]}}>
            <Animated.View style={{transform:[{scale:pulseS}]}}>
              <TouchableOpacity activeOpacity={0.85} onPress={onNext} style={[wn.btn,{height:btnH,borderRadius:btnH/2}]}>
                <View style={[wn.stitch,{borderRadius:btnH/2-4}]}/>
                <View style={wn.btnShine}/>
                <Text style={[wn.btnt,{fontSize:Math.round(26+4*k)}]}>{hasNext?'NEXT':'DONE'}</Text>
                <Svg width={28} height={28} viewBox="0 0 24 24" style={{marginLeft:8}}>
                  <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke="#1f7a22" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* books (left) + pencil cup (right) on the desk, always below the card */}
      <View pointerEvents="none" style={wn.books}>
        {[['Think','#9b4fc0',128],['Learn','#2f7fd0',116],['Grow','#f09a28',122]].map(([t,c,w]:any,i)=>
          <View key={t} style={[wn.book,{backgroundColor:c,width:w,height:bookH,marginLeft:i===1?8:i===2?-4:0}]}><Text style={wn.bookt}>{t}</Text></View>)}
      </View>
      <View pointerEvents="none" style={wn.cup}>
        <View style={[wn.pen,{backgroundColor:'#5fae3a',left:8,height:40,transform:[{rotate:'-10deg'}]}]}/>
        <View style={[wn.pen,{backgroundColor:'#ee6aa0',left:22,height:48}]}/>
        <View style={[wn.pen,{backgroundColor:'#3b8fe8',left:36,height:42,transform:[{rotate:'10deg'}]}]}/>
        <View style={wn.cupBody}><Smiley w={26}/></View>
      </View>
      <Confetti/>
    </View></Stage>
  </View>}

const wn=StyleSheet.create({
  root:{flex:1,backgroundColor:'transparent',overflow:'hidden'},
  head:{position:'absolute',top:34,left:0,right:0,flexDirection:'row',alignItems:'center',paddingHorizontal:14,zIndex:10},
  round:{width:46,height:46,borderRadius:23,backgroundColor:'#ffc928',borderWidth:3,borderColor:'#f0a010',alignItems:'center',justifyContent:'center',elevation:5},
  pill:{flexDirection:'row',alignItems:'center',gap:4,borderRadius:22,paddingHorizontal:14,backgroundColor:'#fff',height:40,borderWidth:2,borderColor:'#d6c8f5',elevation:5},
  pn:{fontFamily:F,fontSize:22,fontWeight:'900',color:NAVY},
  card:{position:'absolute',backgroundColor:'#fbf3de',borderWidth:6,borderColor:'#f7c948',borderRadius:34,elevation:8,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:8,shadowOffset:{width:0,height:4}},
  inner:{flex:1,alignItems:'center',justifyContent:'space-evenly',paddingTop:46,paddingBottom:10,paddingHorizontal:8},
  signWrap:{position:'absolute',top:-56,left:'50%',alignItems:'center',zIndex:5},
  sign:{width:'100%',backgroundColor:'#a85f26',borderWidth:4,borderColor:'#7a4118',borderRadius:18,paddingHorizontal:14,paddingTop:4,paddingBottom:8,alignItems:'center',elevation:6},
  leaf:{position:'absolute',top:-12,width:18,height:30,borderRadius:15,backgroundColor:'#5fae3a',borderWidth:2,borderColor:'#3f8a2a'},
  s1:{fontFamily:F,fontWeight:'900',color:'#fff',textShadowColor:'#5a2f10',textShadowRadius:3,textShadowOffset:{width:1,height:2}},
  s2:{fontFamily:F,fontWeight:'900',color:'#ffd83a',marginTop:-3,textShadowColor:'#8a4a10',textShadowRadius:3,textShadowOffset:{width:1,height:2}},
  starRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'center'},
  sd:{width:26,height:50,alignItems:'center',justifyContent:'center',gap:4},
  dash:{width:16,height:4,borderRadius:2},
  bubble:{backgroundColor:'#e4dbfb',borderWidth:2.5,borderColor:'#b9a8ee',borderRadius:26,paddingHorizontal:18,paddingVertical:8},
  b1:{fontFamily:F,fontWeight:'900',color:NAVY},
  b2:{fontFamily:F,fontWeight:'900',color:'#7a2fd0'},
  sp:{width:20,height:5,borderRadius:3,backgroundColor:'#ffc72c',marginVertical:6},
  btn:{minWidth:200,backgroundColor:'#5fcf3a',borderWidth:4,borderColor:'#2f9a2a',flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:28,overflow:'hidden',elevation:6},
  stitch:{position:'absolute',left:5,right:5,top:5,bottom:5,borderWidth:2,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.8)'},
  btnShine:{position:'absolute',top:6,left:22,right:22,height:10,borderRadius:5,backgroundColor:'rgba(255,255,255,0.35)'},
  btnt:{fontFamily:F,fontWeight:'900',color:'#fff',textShadowColor:'#1f7a22',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
  books:{position:'absolute',left:0,bottom:6},
  book:{borderRadius:5,justifyContent:'center',paddingHorizontal:14,marginTop:1,borderBottomWidth:3,borderBottomColor:'rgba(0,0,0,0.25)',borderTopWidth:3,borderTopColor:'rgba(255,255,255,0.3)'},
  bookt:{fontFamily:F,fontSize:15,fontWeight:'900',color:'#fff'},
  cup:{position:'absolute',right:10,bottom:6,width:68,height:96},
  pen:{position:'absolute',top:0,width:10,borderRadius:3,borderTopLeftRadius:5,borderTopRightRadius:5},
  cupBody:{position:'absolute',bottom:0,left:0,right:0,height:54,backgroundColor:'#f7c928',borderRadius:8,borderWidth:2.5,borderColor:'#e0a81f',alignItems:'center',justifyContent:'center'}});