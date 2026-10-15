// // import React,{useEffect,useRef} from 'react';
// // import {View,Text,TouchableOpacity,Animated,StyleSheet,useWindowDimensions} from 'react-native';
// // import Svg,{Rect,Path,Circle,Polygon,Line,G,Ellipse} from 'react-native-svg';
// // import {F,Stage,Coin,Smiley,loop,useStageW} from './BTShared';

// // const WIcon=({n}:any)=><Svg width={22} height={22} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#fff"/>
// //   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2.6" fill="none"/></G>
// //   :<G><Circle cx="5" cy="12" r="2" fill="#fff"/><Circle cx="12" cy="12" r="2" fill="#fff"/><Circle cx="19" cy="12" r="2" fill="#fff"/></G>}</Svg>;

// // // winking brain mascot with glasses, pointing finger
// // const BrainMascot=({w}:any)=><Svg width={w} height={w*0.85} viewBox="0 0 200 170">
// //   <Path d="M118 142 Q140 152 152 132" stroke="#1c2b4a" strokeWidth="7" fill="none" strokeLinecap="round"/>
// //   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
// //     <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
// //   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
// //     <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
// //   <Path d="M78 48 Q90 58 82 70 M120 46 Q110 58 120 68 M58 88 Q70 94 64 106 M144 88 Q132 96 138 108" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
// //   <Line x1="60" y1="90" x2="42" y2="86" stroke="#1c2b4a" strokeWidth="5" strokeLinecap="round"/>
// //   <Circle cx="78" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
// //   <Circle cx="124" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
// //   <Path d="M97 90 Q101 86 105 90" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
// //   <Circle cx="80" cy="93" r="12" fill="#fff"/><Circle cx="82" cy="94" r="7.5" fill="#1c2b4a"/><Circle cx="84" cy="91" r="2.6" fill="#fff"/>
// //   <Path d="M113 95 Q124 82 135 95" stroke="#1c2b4a" strokeWidth="5" fill="none" strokeLinecap="round"/>
// //   <Circle cx="64" cy="112" r="7" fill="#ff7a96" opacity="0.7"/><Circle cx="140" cy="112" r="7" fill="#ff7a96" opacity="0.7"/>
// //   <Path d="M88 116 Q101 136 114 116 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
// //   <Path d="M94 125 Q101 132 108 125 Q101 121 94 125Z" fill="#ff8aa0"/>
// //   <Circle cx="152" cy="132" r="14" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// //   <Rect x="146" y="106" width="11" height="30" rx="5.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3" transform="rotate(-12 151 121)"/>
// // </Svg>;

// // const BulbDoodle=({w,smile}:any)=><Svg width={w} height={w} viewBox="0 0 50 50">
// //   <Path d="M25 8 C15 8 11 16 14 23 C16 27 18 29 18 33 H32 C32 29 34 27 36 23 C39 16 35 8 25 8Z" stroke="#a79ee0" strokeWidth="1.8" fill="none"/>
// //   <Path d="M19 37 H31 M21 41 H29" stroke="#a79ee0" strokeWidth="1.8" strokeLinecap="round"/>
// //   <Path d="M25 2V4 M8 10 L10 12 M42 10 L40 12 M3 24 H6 M44 24 H47" stroke="#a79ee0" strokeWidth="1.6" strokeLinecap="round"/>
// //   {smile&&<><Circle cx="21" cy="20" r="1.2" fill="#a79ee0"/><Circle cx="29" cy="20" r="1.2" fill="#a79ee0"/><Path d="M20 25 Q25 29 30 25" stroke="#a79ee0" strokeWidth="1.5" fill="none"/></>}</Svg>;
// // const TinyStar=({w}:any)=><Svg width={w} height={w} viewBox="0 0 50 50"><Polygon points="25,6 31,19 45,20 34,30 38,44 25,36 12,44 16,30 5,20 19,19" stroke="#b9b1ea" strokeWidth="2" fill="none" strokeLinejoin="round"/></Svg>;
// // const BookIcon=({k}:any)=><Svg width={24} height={24} viewBox="0 0 24 24">{k==='brain'?<G><Circle cx="9" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Circle cx="15" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M12 6 V19" stroke="#fff" strokeWidth="1.8"/></G>
// //   :k==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="3.6" strokeDasharray="2.8 3.2" fill="none"/><Circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2" fill="none"/></G>
// //   :<G><Path d="M12 3 C7 3 5 8 7 11 C8.5 13 9 14 9 16 H15 C15 14 15.5 13 17 11 C19 8 17 3 12 3Z" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M9.5 19 H14.5 M10.5 21.5 H13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></G>}</Svg>;

// // export default function BTHomeScreen({hints,n,onHome,onGo,err}:any){
// //   const sw=useStageW(),{height:H}=useWindowDimensions();
// //   // ---- responsive sizes (this is the mobile fix) ----
// //   const compact=H<700,deskH=compact?70:96,bookH=compact?38:46,bookW=Math.round(Math.min(200,sw*0.46));
// //   const NBW=sw-48,nbTop=compact?170:186,nbBottom=deskH-34+3*(bookH+2)+8;
// //   const mw=Math.round(Math.min(170,NBW*0.44)),mh=mw*0.85,qFs=Math.floor(Math.min(28,(NBW-80)/11.2));
// //   const padTop=Math.round(mh*0.3)+50;

// //   const enter=useRef(new Animated.Value(0)).current,brainIn=useRef(new Animated.Value(0)).current,
// //     fl=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current,
// //     pu=useRef(new Animated.Value(0)).current,gl=useRef(new Animated.Value(0)).current;
// //   useEffect(()=>{
// //     Animated.sequence([
// //       Animated.spring(enter,{toValue:1,friction:6,tension:60,useNativeDriver:true}),
// //       Animated.spring(brainIn,{toValue:1,friction:4,tension:80,useNativeDriver:true})]).start();
// //     loop(fl,1100);loop(tw,700);loop(pu,800);loop(gl,1800);
// //   },[]);
// //   const nbY=enter.interpolate({inputRange:[0,1],outputRange:[80,0]});
// //   const flY=fl.interpolate({inputRange:[0,1],outputRange:[0,-9]});
// //   const flR=fl.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
// //   const brS=brainIn.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
// //   const twO=tw.interpolate({inputRange:[0,1],outputRange:[0.25,1]});
// //   const puS=pu.interpolate({inputRange:[0,1],outputRange:[1,1.06]});
// //   const glO=gl.interpolate({inputRange:[0,1],outputRange:[0.06,0.16]});
// //   const spark=(style:any,rot:string)=><Animated.View pointerEvents="none" style={[{position:'absolute',width:20,height:5,borderRadius:3,backgroundColor:'#ffd21f',opacity:twO,transform:[{rotate:rot}]},style]}/>;

// //   return <Stage bg="#1a1445">
// //     {/* ---- room ---- */}
// //     <View pointerEvents="none" style={[rd.window,{top:nbTop-10}]}><View style={rd.winV}/><View style={rd.winH}/><View style={[rd.winH,{top:'72%'}]}/></View>
// //     <View pointerEvents="none" style={[rd.shelf,{bottom:deskH}]}>{[['#3b2a8a',26],['#2a5a9a',20],['#7a3a8a',24],['#2a4a8a',18],['#5a3a9a',22],['#2a6a8a',20]].map(([c,w]:any,i)=><View key={i} style={{width:w,height:46+(i%3)*10,backgroundColor:c,marginRight:3,borderTopLeftRadius:3,borderTopRightRadius:3}}/>)}</View>
// //     <View pointerEvents="none" style={[rd.lamp,{left:sw*0.6}]}>
// //       <View style={{width:2,height:46,backgroundColor:'#2a2260'}}/>
// //       <Svg width={70} height={32} viewBox="0 0 74 34"><Path d="M8 34 Q8 6 37 6 Q66 6 66 34 Z" fill="#4a2fa0"/><Path d="M14 30 Q14 12 37 12" stroke="#7a5cf0" strokeWidth="3" fill="none"/></Svg>
// //       <Animated.View style={{position:'absolute',top:62,width:110,height:110,borderRadius:55,backgroundColor:'#ffcf70',opacity:glO}}/>
// //     </View>
// //     <View pointerEvents="none" style={[rd.plant,{bottom:deskH+10}]}>
// //       <Svg width={80} height={130} viewBox="0 0 90 150">
// //         <Path d="M10 150 Q8 110 20 90" stroke="#1f6a2e" strokeWidth="4" fill="none"/>
// //         <Ellipse cx="22" cy="86" rx="12" ry="26" fill="#2fa43f" transform="rotate(20 22 86)"/>
// //         <Ellipse cx="40" cy="104" rx="11" ry="24" fill="#3fbf4e" transform="rotate(60 40 104)"/>
// //         <Ellipse cx="12" cy="112" rx="10" ry="22" fill="#27903a" transform="rotate(-25 12 112)"/>
// //       </Svg>
// //     </View>

// //     {/* ---- notebook ---- */}
// //     <Animated.View style={{position:'absolute',left:24,width:NBW,top:nbTop,bottom:nbBottom,opacity:enter,transform:[{translateY:nbY}]}}>
// //       <View style={rd.nbIn}>
// //         {Array.from({length:14},(_,i)=><View key={i} style={[rd.ln,{top:90+i*34}]}/>)}
// //         <View style={{position:'absolute',left:14,top:84}}><BulbDoodle w={40}/></View>
// //         <View style={{position:'absolute',left:10,top:170}}><TinyStar w={20}/></View>
// //         <View style={{position:'absolute',right:16,top:150}}><TinyStar w={20}/></View>
// //         <View style={{position:'absolute',right:14,bottom:12}}><BulbDoodle w={46} smile/></View>
// //         <Text style={rd.tsg}>{'Think\nSolve\nGrow ♡'}</Text>

// //         <View style={[rd.content,{paddingTop:padTop}]}>
// //           <View style={[rd.qBlob,{paddingVertical:compact?8:12}]}>
// //             <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>ARE YOU READY TO</Text>
// //             <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>TEST YOUR BRAIN?</Text>
// //           </View>
// //           <Svg width={Math.min(230,NBW-80)} height={14} viewBox="0 0 230 14" style={{marginTop:4}}><Path d="M4 10 Q60 2 118 7 Q170 11 226 4" stroke="#f5c518" strokeWidth="4.5" fill="none" strokeLinecap="round"/></Svg>

// //           <Animated.View style={{marginTop:compact?26:38,transform:[{scale:puS}]}}>
// //             <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
// //               <View style={rd.btnShine}/>
// //               <Svg width={30} height={30} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg>
// //               <Text style={rd.btnt}>READY</Text>
// //             </View></TouchableOpacity>
// //             {spark({right:-26,top:8},'-35deg')}{spark({right:-30,top:28},'0deg')}{spark({right:-24,top:48},'35deg')}
// //           </Animated.View>
// //           {!!err&&<Text style={rd.err}>{err}</Text>}
// //         </View>
// //       </View>

// //       <View pointerEvents="none" style={rd.rings}>{Array.from({length:9},(_,i)=><View key={i} style={rd.ring}/>)}</View>

// //       <Animated.View pointerEvents="none" style={[rd.lvTag,{opacity:brainIn,transform:[{rotate:'-2deg'},{scale:brS}]}]}>
// //         <Text style={rd.lvt}>{'LEVEL '}<Text style={{color:'#ffd21f'}}>{n}</Text></Text></Animated.View>

// //       <Animated.View pointerEvents="none" style={{position:'absolute',top:-mh*0.68,left:14,transform:[{translateY:flY},{rotate:flR},{scale:brS}]}}>
// //         <BrainMascot w={mw}/>
// //       </Animated.View>
// //       {spark({left:mw+16,top:-mh*0.6},'60deg')}{spark({left:mw+24,top:-mh*0.4},'20deg')}
// //     </Animated.View>

// //     {/* ---- desk ---- */}
// //     <View pointerEvents="none" style={[rd.desk,{height:deskH}]}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:20+i*22,height:2,backgroundColor:'rgba(70,30,5,0.18)'}}/>)}</View>

// //     <View pointerEvents="none" style={{position:'absolute',left:-8,bottom:deskH-34}}>
// //       {[['Unlock','#7a3fd0','brain',0],['Solve','#2f6fd8','gear',6],['Think','#f0a020','bulb',-4]].map(([t,c,k,ml]:any)=>
// //         <View key={t} style={[rd.book,{backgroundColor:c,width:bookW,height:bookH,marginLeft:ml}]}>
// //           <View style={rd.bookIc}><BookIcon k={k}/></View>
// //           <Text style={rd.bookt}>{t}</Text>
// //           <View style={rd.bookPg}/>
// //         </View>)}
// //     </View>

// //     <View pointerEvents="none" style={[rd.cup,{bottom:deskH-34}]}>
// //       <View style={[rd.pen,{backgroundColor:'#3a8be0',left:12,height:64,transform:[{rotate:'-16deg'}]}]}/>
// //       <View style={[rd.pen,{backgroundColor:'#f6b928',left:32,height:74,transform:[{rotate:'-4deg'}]}]}/>
// //       <View style={[rd.pen,{backgroundColor:'#ee5a8a',left:52,height:80,transform:[{rotate:'10deg'}]}]}/>
// //       <View style={rd.cupBody}><Smiley w={40} c="#1c2350"/></View>
// //     </View>

// //     {/* ---- top bar ---- */}
// //     <View style={rd.top}>
// //       <TouchableOpacity onPress={onHome} style={[rd.tb,{borderColor:'#3aa6ff'}]}><WIcon n="home"/></TouchableOpacity>
// //       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="gear"/></TouchableOpacity>
// //       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="dots"/></TouchableOpacity>
// //       <View style={{flex:1}}/>
// //       <View style={rd.cpill}><Coin s={24}/><Text style={rd.cnum}>{hints}</Text><View style={rd.cplus}><Text style={rd.cplust}>+</Text></View></View>
// //     </View>
// //   </Stage>}

// // const rd=StyleSheet.create({
// //   window:{position:'absolute',right:-6,width:70,height:290,backgroundColor:'rgba(43,86,200,0.55)',borderWidth:4,borderColor:'#3a2a8a'},
// //   winV:{position:'absolute',left:'48%',top:0,bottom:0,width:4,backgroundColor:'#3a2a8a'},
// //   winH:{position:'absolute',left:0,right:0,top:'34%',height:4,backgroundColor:'#3a2a8a'},
// //   shelf:{position:'absolute',left:0,right:0,flexDirection:'row',alignItems:'flex-end',justifyContent:'center',opacity:0.35},
// //   lamp:{position:'absolute',top:0,alignItems:'center'},
// //   plant:{position:'absolute',left:-18},
// //   top:{position:'absolute',top:34,left:0,right:0,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10},
// //   tb:{width:44,height:44,borderRadius:22,backgroundColor:'#1a2a6a',borderWidth:3,alignItems:'center',justifyContent:'center'},
// //   cpill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#241a6e',borderWidth:3,borderColor:'#6a4fe0',borderRadius:24,paddingHorizontal:10,height:44},
// //   cnum:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#fff',minWidth:16,textAlign:'center'},
// //   cplus:{width:26,height:26,borderRadius:13,backgroundColor:'#2fc24a',alignItems:'center',justifyContent:'center'},
// //   cplust:{color:'#fff',fontWeight:'900',fontSize:18,lineHeight:22},
// //   nbIn:{...StyleSheet.absoluteFillObject,backgroundColor:'#f7efdd',borderRadius:20,overflow:'hidden',borderBottomWidth:6,borderBottomColor:'#d9cdb0'},
// //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e7dcc2'},
// //   rings:{position:'absolute',top:-14,left:0,right:0,flexDirection:'row',justifyContent:'space-around',paddingHorizontal:16},
// //   ring:{width:12,height:34,borderRadius:6,backgroundColor:'#1c2350',borderWidth:2,borderColor:'#4a5ac0'},
// //   content:{flex:1,alignItems:'center',paddingHorizontal:14},
// //   qBlob:{backgroundColor:'#dcd6f5',borderRadius:30,paddingHorizontal:18,alignItems:'center'},
// //   q:{fontFamily:F,fontWeight:'900',color:'#1c2350',textAlign:'center'},
// //   btnOuter:{backgroundColor:'#0f5a2a',borderRadius:42,padding:4,elevation:6,shadowColor:'#000',shadowOpacity:0.3,shadowRadius:5,shadowOffset:{width:0,height:4}},
// //   btnIn:{backgroundColor:'#34c73c',borderRadius:38,paddingHorizontal:38,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden'},
// //   btnShine:{position:'absolute',top:4,left:20,right:20,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.35)'},
// //   btnt:{fontFamily:F,fontSize:38,fontWeight:'900',color:'#fff',textShadowColor:'rgba(0,60,20,0.6)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
// //   err:{color:'#d63a5a',marginTop:12,fontFamily:F,fontSize:14,textAlign:'center'},
// //   tsg:{position:'absolute',left:14,bottom:14,fontFamily:F,fontSize:16,fontStyle:'italic',fontWeight:'bold',color:'#6a5fd0',lineHeight:20,transform:[{rotate:'-8deg'}]},
// //   lvTag:{position:'absolute',top:-16,right:14,backgroundColor:'#5b4fe0',paddingHorizontal:16,paddingVertical:6,borderRadius:6},
// //   lvt:{fontFamily:F,fontSize:22,fontWeight:'900',color:'#fff'},
// //   desk:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#b0622a',borderTopWidth:5,borderTopColor:'#d98b4a'},
// //   book:{borderRadius:6,flexDirection:'row',alignItems:'center',paddingLeft:14,marginTop:2,borderBottomWidth:4,borderBottomColor:'rgba(0,0,0,0.25)'},
// //   bookIc:{width:30,height:30,borderRadius:15,borderWidth:2,borderColor:'rgba(255,255,255,0.6)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.12)'},
// //   bookt:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',marginLeft:10,flex:1},
// //   bookPg:{width:26,height:26,borderRadius:4,marginRight:10,borderWidth:2,borderColor:'rgba(255,255,255,0.35)'},
// //   cup:{position:'absolute',right:-6,width:90,height:132},
// //   pen:{position:'absolute',top:0,width:11,borderRadius:3,borderTopLeftRadius:6,borderTopRightRadius:6},
// //   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:74,backgroundColor:'#f7f5ee',borderRadius:10,borderWidth:3,borderColor:'#d8d4c8',alignItems:'center',justifyContent:'center'}});
// import React,{useEffect,useRef} from 'react';
// import {View,Text,TouchableOpacity,Animated,StyleSheet,useWindowDimensions} from 'react-native';
// import Svg,{Rect,Path,Circle,Polygon,Line,G,Ellipse} from 'react-native-svg';
// import {F,Stage,Coin,Smiley,loop,useStageW} from './BTShared';

// const WIcon=({n}:any)=><Svg width={22} height={22} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#fff"/>
//   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2.6" fill="none"/></G>
//   :<G><Circle cx="5" cy="12" r="2" fill="#fff"/><Circle cx="12" cy="12" r="2" fill="#fff"/><Circle cx="19" cy="12" r="2" fill="#fff"/></G>}</Svg>;

// // winking brain mascot with glasses, pointing finger
// const BrainMascot=({w}:any)=><Svg width={w} height={w*0.85} viewBox="0 0 200 170">
//   <Path d="M118 142 Q140 152 152 132" stroke="#1c2b4a" strokeWidth="7" fill="none" strokeLinecap="round"/>
//   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
//     <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
//   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
//     <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
//   <Path d="M78 48 Q90 58 82 70 M120 46 Q110 58 120 68 M58 88 Q70 94 64 106 M144 88 Q132 96 138 108" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
//   <Line x1="60" y1="90" x2="42" y2="86" stroke="#1c2b4a" strokeWidth="5" strokeLinecap="round"/>
//   <Circle cx="78" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
//   <Circle cx="124" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
//   <Path d="M97 90 Q101 86 105 90" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
//   <Circle cx="80" cy="93" r="12" fill="#fff"/><Circle cx="82" cy="94" r="7.5" fill="#1c2b4a"/><Circle cx="84" cy="91" r="2.6" fill="#fff"/>
//   <Path d="M113 95 Q124 82 135 95" stroke="#1c2b4a" strokeWidth="5" fill="none" strokeLinecap="round"/>
//   <Circle cx="64" cy="112" r="7" fill="#ff7a96" opacity="0.7"/><Circle cx="140" cy="112" r="7" fill="#ff7a96" opacity="0.7"/>
//   <Path d="M88 116 Q101 136 114 116 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
//   <Path d="M94 125 Q101 132 108 125 Q101 121 94 125Z" fill="#ff8aa0"/>
//   <Circle cx="152" cy="132" r="14" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
//   <Rect x="146" y="106" width="11" height="30" rx="5.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3" transform="rotate(-12 151 121)"/>
// </Svg>;

// const BulbDoodle=({w,smile}:any)=><Svg width={w} height={w} viewBox="0 0 50 50">
//   <Path d="M25 8 C15 8 11 16 14 23 C16 27 18 29 18 33 H32 C32 29 34 27 36 23 C39 16 35 8 25 8Z" stroke="#a79ee0" strokeWidth="1.8" fill="none"/>
//   <Path d="M19 37 H31 M21 41 H29" stroke="#a79ee0" strokeWidth="1.8" strokeLinecap="round"/>
//   <Path d="M25 2V4 M8 10 L10 12 M42 10 L40 12 M3 24 H6 M44 24 H47" stroke="#a79ee0" strokeWidth="1.6" strokeLinecap="round"/>
//   {smile&&<><Circle cx="21" cy="20" r="1.2" fill="#a79ee0"/><Circle cx="29" cy="20" r="1.2" fill="#a79ee0"/><Path d="M20 25 Q25 29 30 25" stroke="#a79ee0" strokeWidth="1.5" fill="none"/></>}</Svg>;
// const TinyStar=({w}:any)=><Svg width={w} height={w} viewBox="0 0 50 50"><Polygon points="25,6 31,19 45,20 34,30 38,44 25,36 12,44 16,30 5,20 19,19" stroke="#b9b1ea" strokeWidth="2" fill="none" strokeLinejoin="round"/></Svg>;
// const BookIcon=({k}:any)=><Svg width={24} height={24} viewBox="0 0 24 24">{k==='brain'?<G><Circle cx="9" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Circle cx="15" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M12 6 V19" stroke="#fff" strokeWidth="1.8"/></G>
//   :k==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="3.6" strokeDasharray="2.8 3.2" fill="none"/><Circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2" fill="none"/></G>
//   :<G><Path d="M12 3 C7 3 5 8 7 11 C8.5 13 9 14 9 16 H15 C15 14 15.5 13 17 11 C19 8 17 3 12 3Z" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M9.5 19 H14.5 M10.5 21.5 H13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></G>}</Svg>;

// export default function BTHomeScreen({hints,n,onHome,onGo,err}:any){
//   const sw=useStageW(),{height:H}=useWindowDimensions();
//   // ---- responsive sizes (this is the mobile fix) ----
//   const compact=H<700,deskH=compact?70:96,bookH=compact?38:46,bookW=Math.round(Math.min(200,sw*0.46));
//   const NBW=sw-48,nbTop=compact?170:186,nbBottom=deskH-34+3*(bookH+2)+8;
//   const mw=Math.round(Math.min(170,NBW*0.44)),mh=mw*0.85,qFs=Math.floor(Math.min(28,(NBW-80)/11.2));
//   const padTop=Math.round(mh*0.3)+50;

//   const enter=useRef(new Animated.Value(0)).current,brainIn=useRef(new Animated.Value(0)).current,
//     fl=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current,
//     pu=useRef(new Animated.Value(0)).current,gl=useRef(new Animated.Value(0)).current;
//   useEffect(()=>{
//     Animated.sequence([
//       Animated.spring(enter,{toValue:1,friction:6,tension:60,useNativeDriver:true}),
//       Animated.spring(brainIn,{toValue:1,friction:4,tension:80,useNativeDriver:true})]).start();
//     loop(fl,1100);loop(tw,700);loop(pu,800);loop(gl,1800);
//   },[]);
//   const nbY=enter.interpolate({inputRange:[0,1],outputRange:[80,0]});
//   const flY=fl.interpolate({inputRange:[0,1],outputRange:[0,-9]});
//   const flR=fl.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
//   const brS=brainIn.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
//   const twO=tw.interpolate({inputRange:[0,1],outputRange:[0.25,1]});
//   const puS=pu.interpolate({inputRange:[0,1],outputRange:[1,1.06]});
//   const glO=gl.interpolate({inputRange:[0,1],outputRange:[0.06,0.16]});
//   const spark=(style:any,rot:string)=><Animated.View pointerEvents="none" style={[{position:'absolute',width:20,height:5,borderRadius:3,backgroundColor:'#ffd21f',opacity:twO,transform:[{rotate:rot}]},style]}/>;

//   return <Stage bg="#1a1445">
//     {/* ---- room ---- */}
//     <View pointerEvents="none" style={[rd.window,{top:nbTop-10}]}><View style={rd.winV}/><View style={rd.winH}/><View style={[rd.winH,{top:'72%'}]}/></View>
//     <View pointerEvents="none" style={[rd.shelf,{bottom:deskH}]}>{[['#3b2a8a',26],['#2a5a9a',20],['#7a3a8a',24],['#2a4a8a',18],['#5a3a9a',22],['#2a6a8a',20]].map(([c,w]:any,i)=><View key={i} style={{width:w,height:46+(i%3)*10,backgroundColor:c,marginRight:3,borderTopLeftRadius:3,borderTopRightRadius:3}}/>)}</View>
//     <View pointerEvents="none" style={[rd.lamp,{left:sw*0.6}]}>
//       <View style={{width:2,height:46,backgroundColor:'#2a2260'}}/>
//       <Svg width={70} height={32} viewBox="0 0 74 34"><Path d="M8 34 Q8 6 37 6 Q66 6 66 34 Z" fill="#4a2fa0"/><Path d="M14 30 Q14 12 37 12" stroke="#7a5cf0" strokeWidth="3" fill="none"/></Svg>
//       <Animated.View style={{position:'absolute',top:62,width:110,height:110,borderRadius:55,backgroundColor:'#ffcf70',opacity:glO}}/>
//     </View>
//     <View pointerEvents="none" style={[rd.plant,{bottom:deskH+10}]}>
//       <Svg width={80} height={130} viewBox="0 0 90 150">
//         <Path d="M10 150 Q8 110 20 90" stroke="#1f6a2e" strokeWidth="4" fill="none"/>
//         <Ellipse cx="22" cy="86" rx="12" ry="26" fill="#2fa43f" transform="rotate(20 22 86)"/>
//         <Ellipse cx="40" cy="104" rx="11" ry="24" fill="#3fbf4e" transform="rotate(60 40 104)"/>
//         <Ellipse cx="12" cy="112" rx="10" ry="22" fill="#27903a" transform="rotate(-25 12 112)"/>
//       </Svg>
//     </View>

//     {/* ---- notebook ---- */}
//     <Animated.View style={{position:'absolute',left:24,width:NBW,top:nbTop,bottom:nbBottom,opacity:enter,transform:[{translateY:nbY}]}}>
//       <View style={rd.nbIn}>
//         {Array.from({length:14},(_,i)=><View key={i} style={[rd.ln,{top:90+i*34}]}/>)}
//         <View style={{position:'absolute',left:14,top:84}}><BulbDoodle w={40}/></View>
//         <View style={{position:'absolute',left:10,top:170}}><TinyStar w={20}/></View>
//         <View style={{position:'absolute',right:16,top:150}}><TinyStar w={20}/></View>
//         <View style={{position:'absolute',right:14,bottom:12}}><BulbDoodle w={46} smile/></View>
//         <Text style={rd.tsg}>{'Think\nSolve\nGrow ♡'}</Text>

//         <View style={[rd.content,{paddingTop:padTop}]}>
//           <View style={[rd.qBlob,{paddingVertical:compact?8:12}]}>
//             <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>ARE YOU READY TO</Text>
//             <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>TEST YOUR BRAIN?</Text>
//           </View>
//           <Svg width={Math.min(230,NBW-80)} height={14} viewBox="0 0 230 14" style={{marginTop:4}}><Path d="M4 10 Q60 2 118 7 Q170 11 226 4" stroke="#f5c518" strokeWidth="4.5" fill="none" strokeLinecap="round"/></Svg>

//           <Animated.View style={{marginTop:compact?26:38,transform:[{scale:puS}]}}>
//             <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
//               <View style={rd.btnShine}/>
//               <Svg width={30} height={30} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg>
//               <Text style={rd.btnt}>READY</Text>
//             </View></TouchableOpacity>
//             {spark({right:-26,top:8},'-35deg')}{spark({right:-30,top:28},'0deg')}{spark({right:-24,top:48},'35deg')}
//           </Animated.View>
//           {!!err&&<Text style={rd.err}>{err}</Text>}
//         </View>
//       </View>

//       <View pointerEvents="none" style={rd.rings}>{Array.from({length:9},(_,i)=><View key={i} style={rd.ring}/>)}</View>

//       <Animated.View pointerEvents="none" style={[rd.lvTag,{opacity:brainIn,transform:[{rotate:'-2deg'},{scale:brS}]}]}>
//         <Text style={rd.lvt}>{'LEVEL '}<Text style={{color:'#ffd21f'}}>{n}</Text></Text></Animated.View>

//       <Animated.View pointerEvents="none" style={{position:'absolute',top:-mh*0.68,left:14,transform:[{translateY:flY},{rotate:flR},{scale:brS}]}}>
//         <BrainMascot w={mw}/>
//       </Animated.View>
//       {spark({left:mw+16,top:-mh*0.6},'60deg')}{spark({left:mw+24,top:-mh*0.4},'20deg')}
//     </Animated.View>

//     {/* ---- desk ---- */}
//     <View pointerEvents="none" style={[rd.desk,{height:deskH}]}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:20+i*22,height:2,backgroundColor:'rgba(70,30,5,0.18)'}}/>)}</View>

//     <View pointerEvents="none" style={{position:'absolute',left:-8,bottom:deskH-34}}>
//       {[['Unlock','#7a3fd0','brain',0],['Solve','#2f6fd8','gear',6],['Think','#f0a020','bulb',-4]].map(([t,c,k,ml]:any)=>
//         <View key={t} style={[rd.book,{backgroundColor:c,width:bookW,height:bookH,marginLeft:ml}]}>
//           <View style={rd.bookIc}><BookIcon k={k}/></View>
//           <Text style={rd.bookt}>{t}</Text>
//           <View style={rd.bookPg}/>
//         </View>)}
//     </View>

//     <View pointerEvents="none" style={[rd.cup,{bottom:deskH-34}]}>
//       <View style={[rd.pen,{backgroundColor:'#3a8be0',left:12,height:64,transform:[{rotate:'-16deg'}]}]}/>
//       <View style={[rd.pen,{backgroundColor:'#f6b928',left:32,height:74,transform:[{rotate:'-4deg'}]}]}/>
//       <View style={[rd.pen,{backgroundColor:'#ee5a8a',left:52,height:80,transform:[{rotate:'10deg'}]}]}/>
//       <View style={rd.cupBody}><Smiley w={40} c="#1c2350"/></View>
//     </View>

//     {/* ---- top bar ---- */}
//     <View style={rd.top}>
//       <TouchableOpacity onPress={onHome} style={[rd.tb,{borderColor:'#3aa6ff'}]}><WIcon n="home"/></TouchableOpacity>
//       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="gear"/></TouchableOpacity>
//       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="dots"/></TouchableOpacity>
//       <View style={{flex:1}}/>
//       <View style={rd.cpill}><Coin s={24}/><Text style={rd.cnum}>{hints}</Text><View style={rd.cplus}><Text style={rd.cplust}>+</Text></View></View>
//     </View>
//   </Stage>}

// const rd=StyleSheet.create({
//   window:{position:'absolute',right:-6,width:70,height:290,backgroundColor:'rgba(43,86,200,0.55)',borderWidth:4,borderColor:'#3a2a8a'},
//   winV:{position:'absolute',left:'48%',top:0,bottom:0,width:4,backgroundColor:'#3a2a8a'},
//   winH:{position:'absolute',left:0,right:0,top:'34%',height:4,backgroundColor:'#3a2a8a'},
//   shelf:{position:'absolute',left:0,right:0,flexDirection:'row',alignItems:'flex-end',justifyContent:'center',opacity:0.35},
//   lamp:{position:'absolute',top:0,alignItems:'center'},
//   plant:{position:'absolute',left:-18},
//   top:{position:'absolute',top:34,left:0,right:0,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10},
//   tb:{width:44,height:44,borderRadius:22,backgroundColor:'#1a2a6a',borderWidth:3,alignItems:'center',justifyContent:'center'},
//   cpill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#241a6e',borderWidth:3,borderColor:'#6a4fe0',borderRadius:24,paddingHorizontal:10,height:44},
//   cnum:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#fff',minWidth:16,textAlign:'center'},
//   cplus:{width:26,height:26,borderRadius:13,backgroundColor:'#2fc24a',alignItems:'center',justifyContent:'center'},
//   cplust:{color:'#fff',fontWeight:'900',fontSize:18,lineHeight:22},
//   // FIX: StyleSheet.absoluteFillObject removed -> explicit absolute fill
//   nbIn:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#f7efdd',borderRadius:20,overflow:'hidden',borderBottomWidth:6,borderBottomColor:'#d9cdb0'},
//   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e7dcc2'},
//   rings:{position:'absolute',top:-14,left:0,right:0,flexDirection:'row',justifyContent:'space-around',paddingHorizontal:16},
//   ring:{width:12,height:34,borderRadius:6,backgroundColor:'#1c2350',borderWidth:2,borderColor:'#4a5ac0'},
//   content:{flex:1,alignItems:'center',paddingHorizontal:14},
//   qBlob:{backgroundColor:'#dcd6f5',borderRadius:30,paddingHorizontal:18,alignItems:'center'},
//   q:{fontFamily:F,fontWeight:'900',color:'#1c2350',textAlign:'center'},
//   btnOuter:{backgroundColor:'#0f5a2a',borderRadius:42,padding:4,elevation:6,shadowColor:'#000',shadowOpacity:0.3,shadowRadius:5,shadowOffset:{width:0,height:4}},
//   btnIn:{backgroundColor:'#34c73c',borderRadius:38,paddingHorizontal:38,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden'},
//   btnShine:{position:'absolute',top:4,left:20,right:20,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.35)'},
//   btnt:{fontFamily:F,fontSize:38,fontWeight:'900',color:'#fff',textShadowColor:'rgba(0,60,20,0.6)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
//   err:{color:'#d63a5a',marginTop:12,fontFamily:F,fontSize:14,textAlign:'center'},
//   tsg:{position:'absolute',left:14,bottom:14,fontFamily:F,fontSize:16,fontStyle:'italic',fontWeight:'bold',color:'#6a5fd0',lineHeight:20,transform:[{rotate:'-8deg'}]},
//   lvTag:{position:'absolute',top:-16,right:14,backgroundColor:'#5b4fe0',paddingHorizontal:16,paddingVertical:6,borderRadius:6},
//   lvt:{fontFamily:F,fontSize:22,fontWeight:'900',color:'#fff'},
//   desk:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#b0622a',borderTopWidth:5,borderTopColor:'#d98b4a'},
//   book:{borderRadius:6,flexDirection:'row',alignItems:'center',paddingLeft:14,marginTop:2,borderBottomWidth:4,borderBottomColor:'rgba(0,0,0,0.25)'},
//   bookIc:{width:30,height:30,borderRadius:15,borderWidth:2,borderColor:'rgba(255,255,255,0.6)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.12)'},
//   bookt:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',marginLeft:10,flex:1},
//   bookPg:{width:26,height:26,borderRadius:4,marginRight:10,borderWidth:2,borderColor:'rgba(255,255,255,0.35)'},
//   cup:{position:'absolute',right:-6,width:90,height:132},
//   pen:{position:'absolute',top:0,width:11,borderRadius:3,borderTopLeftRadius:6,borderTopRightRadius:6},
//   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:74,backgroundColor:'#f7f5ee',borderRadius:10,borderWidth:3,borderColor:'#d8d4c8',alignItems:'center',justifyContent:'center'}});
import React,{useEffect,useRef} from 'react';
import {View,Text,TouchableOpacity,Animated,StyleSheet,useWindowDimensions} from 'react-native';
import Svg,{Rect,Path,Circle,Polygon,Line,G,Ellipse} from 'react-native-svg';
import {F,Stage,Coin,Smiley,loop,useStageW} from './BTShared';

const WIcon=({n}:any)=><Svg width={22} height={22} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#fff"/>
  :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2.6" fill="none"/></G>
  :<G><Circle cx="5" cy="12" r="2" fill="#fff"/><Circle cx="12" cy="12" r="2" fill="#fff"/><Circle cx="19" cy="12" r="2" fill="#fff"/></G>}</Svg>;

// winking brain mascot with glasses, pointing finger
const BrainMascot=({w}:any)=><Svg width={w} height={w*0.85} viewBox="0 0 200 170">
  <Path d="M118 142 Q140 152 152 132" stroke="#1c2b4a" strokeWidth="7" fill="none" strokeLinecap="round"/>
  {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
    <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
  {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
    <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
  <Path d="M78 48 Q90 58 82 70 M120 46 Q110 58 120 68 M58 88 Q70 94 64 106 M144 88 Q132 96 138 108" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
  <Line x1="60" y1="90" x2="42" y2="86" stroke="#1c2b4a" strokeWidth="5" strokeLinecap="round"/>
  <Circle cx="78" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
  <Circle cx="124" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
  <Path d="M97 90 Q101 86 105 90" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
  <Circle cx="80" cy="93" r="12" fill="#fff"/><Circle cx="82" cy="94" r="7.5" fill="#1c2b4a"/><Circle cx="84" cy="91" r="2.6" fill="#fff"/>
  <Path d="M113 95 Q124 82 135 95" stroke="#1c2b4a" strokeWidth="5" fill="none" strokeLinecap="round"/>
  <Circle cx="64" cy="112" r="7" fill="#ff7a96" opacity="0.7"/><Circle cx="140" cy="112" r="7" fill="#ff7a96" opacity="0.7"/>
  <Path d="M88 116 Q101 136 114 116 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
  <Path d="M94 125 Q101 132 108 125 Q101 121 94 125Z" fill="#ff8aa0"/>
  <Circle cx="152" cy="132" r="14" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
  <Rect x="146" y="106" width="11" height="30" rx="5.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3" transform="rotate(-12 151 121)"/>
</Svg>;

const BulbDoodle=({w,smile}:any)=><Svg width={w} height={w} viewBox="0 0 50 50">
  <Path d="M25 8 C15 8 11 16 14 23 C16 27 18 29 18 33 H32 C32 29 34 27 36 23 C39 16 35 8 25 8Z" stroke="#a79ee0" strokeWidth="1.8" fill="none"/>
  <Path d="M19 37 H31 M21 41 H29" stroke="#a79ee0" strokeWidth="1.8" strokeLinecap="round"/>
  <Path d="M25 2V4 M8 10 L10 12 M42 10 L40 12 M3 24 H6 M44 24 H47" stroke="#a79ee0" strokeWidth="1.6" strokeLinecap="round"/>
  {smile&&<><Circle cx="21" cy="20" r="1.2" fill="#a79ee0"/><Circle cx="29" cy="20" r="1.2" fill="#a79ee0"/><Path d="M20 25 Q25 29 30 25" stroke="#a79ee0" strokeWidth="1.5" fill="none"/></>}</Svg>;
const TinyStar=({w}:any)=><Svg width={w} height={w} viewBox="0 0 50 50"><Polygon points="25,6 31,19 45,20 34,30 38,44 25,36 12,44 16,30 5,20 19,19" stroke="#b9b1ea" strokeWidth="2" fill="none" strokeLinejoin="round"/></Svg>;
const BookIcon=({k}:any)=><Svg width={24} height={24} viewBox="0 0 24 24">{k==='brain'?<G><Circle cx="9" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Circle cx="15" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M12 6 V19" stroke="#fff" strokeWidth="1.8"/></G>
  :k==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="3.6" strokeDasharray="2.8 3.2" fill="none"/><Circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2" fill="none"/></G>
  :<G><Path d="M12 3 C7 3 5 8 7 11 C8.5 13 9 14 9 16 H15 C15 14 15.5 13 17 11 C19 8 17 3 12 3Z" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M9.5 19 H14.5 M10.5 21.5 H13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></G>}</Svg>;

export default function BTHomeScreen({hints,n,onHome,onGo,onLevels,err}:any){
  const sw=useStageW(),{height:H}=useWindowDimensions();
  // ---- responsive sizes (this is the mobile fix) ----
  const compact=H<700,deskH=compact?70:96,bookH=compact?38:46,bookW=Math.round(Math.min(200,sw*0.46));
  const NBW=sw-48,nbTop=compact?170:186,nbBottom=deskH-34+3*(bookH+2)+8;
  const mw=Math.round(Math.min(170,NBW*0.44)),mh=mw*0.85,qFs=Math.floor(Math.min(28,(NBW-80)/11.2));
  const padTop=Math.round(mh*0.3)+50;

  const enter=useRef(new Animated.Value(0)).current,brainIn=useRef(new Animated.Value(0)).current,
    fl=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current,
    pu=useRef(new Animated.Value(0)).current,gl=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.sequence([
      Animated.spring(enter,{toValue:1,friction:6,tension:60,useNativeDriver:true}),
      Animated.spring(brainIn,{toValue:1,friction:4,tension:80,useNativeDriver:true})]).start();
    loop(fl,1100);loop(tw,700);loop(pu,800);loop(gl,1800);
  },[]);
  const nbY=enter.interpolate({inputRange:[0,1],outputRange:[80,0]});
  const flY=fl.interpolate({inputRange:[0,1],outputRange:[0,-9]});
  const flR=fl.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
  const brS=brainIn.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
  const twO=tw.interpolate({inputRange:[0,1],outputRange:[0.25,1]});
  const puS=pu.interpolate({inputRange:[0,1],outputRange:[1,1.06]});
  const glO=gl.interpolate({inputRange:[0,1],outputRange:[0.06,0.16]});
  const spark=(style:any,rot:string)=><Animated.View pointerEvents="none" style={[{position:'absolute',width:20,height:5,borderRadius:3,backgroundColor:'#ffd21f',opacity:twO,transform:[{rotate:rot}]},style]}/>;

  return <Stage bg="#1a1445">
    {/* ---- room ---- */}
    <View pointerEvents="none" style={[rd.window,{top:nbTop-10}]}><View style={rd.winV}/><View style={rd.winH}/><View style={[rd.winH,{top:'72%'}]}/></View>
    <View pointerEvents="none" style={[rd.shelf,{bottom:deskH}]}>{[['#3b2a8a',26],['#2a5a9a',20],['#7a3a8a',24],['#2a4a8a',18],['#5a3a9a',22],['#2a6a8a',20]].map(([c,w]:any,i)=><View key={i} style={{width:w,height:46+(i%3)*10,backgroundColor:c,marginRight:3,borderTopLeftRadius:3,borderTopRightRadius:3}}/>)}</View>
    <View pointerEvents="none" style={[rd.lamp,{left:sw*0.6}]}>
      <View style={{width:2,height:46,backgroundColor:'#2a2260'}}/>
      <Svg width={70} height={32} viewBox="0 0 74 34"><Path d="M8 34 Q8 6 37 6 Q66 6 66 34 Z" fill="#4a2fa0"/><Path d="M14 30 Q14 12 37 12" stroke="#7a5cf0" strokeWidth="3" fill="none"/></Svg>
      <Animated.View style={{position:'absolute',top:62,width:110,height:110,borderRadius:55,backgroundColor:'#ffcf70',opacity:glO}}/>
    </View>
    <View pointerEvents="none" style={[rd.plant,{bottom:deskH+10}]}>
      <Svg width={80} height={130} viewBox="0 0 90 150">
        <Path d="M10 150 Q8 110 20 90" stroke="#1f6a2e" strokeWidth="4" fill="none"/>
        <Ellipse cx="22" cy="86" rx="12" ry="26" fill="#2fa43f" transform="rotate(20 22 86)"/>
        <Ellipse cx="40" cy="104" rx="11" ry="24" fill="#3fbf4e" transform="rotate(60 40 104)"/>
        <Ellipse cx="12" cy="112" rx="10" ry="22" fill="#27903a" transform="rotate(-25 12 112)"/>
      </Svg>
    </View>

    {/* ---- notebook ---- */}
    <Animated.View style={{position:'absolute',left:24,width:NBW,top:nbTop,bottom:nbBottom,opacity:enter,transform:[{translateY:nbY}]}}>
      <View style={rd.nbIn}>
        {Array.from({length:14},(_,i)=><View key={i} style={[rd.ln,{top:90+i*34}]}/>)}
        <View style={{position:'absolute',left:14,top:84}}><BulbDoodle w={40}/></View>
        <View style={{position:'absolute',left:10,top:170}}><TinyStar w={20}/></View>
        <View style={{position:'absolute',right:16,top:150}}><TinyStar w={20}/></View>
        <View style={{position:'absolute',right:14,bottom:12}}><BulbDoodle w={46} smile/></View>
        <Text style={rd.tsg}>{'Think\nSolve\nGrow ♡'}</Text>

        <View style={[rd.content,{paddingTop:padTop}]}>
          <View style={[rd.qBlob,{paddingVertical:compact?8:12}]}>
            <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>ARE YOU READY TO</Text>
            <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>TEST YOUR BRAIN?</Text>
          </View>
          <Svg width={Math.min(230,NBW-80)} height={14} viewBox="0 0 230 14" style={{marginTop:4}}><Path d="M4 10 Q60 2 118 7 Q170 11 226 4" stroke="#f5c518" strokeWidth="4.5" fill="none" strokeLinecap="round"/></Svg>

          <Animated.View style={{marginTop:compact?16:26,transform:[{scale:puS}]}}>
            <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
              <View style={rd.btnShine}/>
              <Svg width={30} height={30} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg>
              <Text style={rd.btnt}>READY</Text>
            </View></TouchableOpacity>
            {spark({right:-26,top:8},'-35deg')}{spark({right:-30,top:28},'0deg')}{spark({right:-24,top:48},'35deg')}
          </Animated.View>
          <TouchableOpacity onPress={onLevels} activeOpacity={0.85} style={[rd.lvBtnOuter,{marginTop:compact?14:20}]}><View style={rd.lvBtnIn}>
            <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></Svg>
            <Text style={rd.lvBtnT}>LEVELS</Text>
          </View></TouchableOpacity>
          {!!err&&<Text style={rd.err}>{err}</Text>}
        </View>
      </View>

      <View pointerEvents="none" style={rd.rings}>{Array.from({length:9},(_,i)=><View key={i} style={rd.ring}/>)}</View>

      <Animated.View pointerEvents="none" style={[rd.lvTag,{opacity:brainIn,transform:[{rotate:'-2deg'},{scale:brS}]}]}>
        <Text style={rd.lvt}>{'LEVEL '}<Text style={{color:'#ffd21f'}}>{n}</Text></Text></Animated.View>

      <Animated.View pointerEvents="none" style={{position:'absolute',top:-mh*0.68,left:14,transform:[{translateY:flY},{rotate:flR},{scale:brS}]}}>
        <BrainMascot w={mw}/>
      </Animated.View>
      {spark({left:mw+16,top:-mh*0.6},'60deg')}{spark({left:mw+24,top:-mh*0.4},'20deg')}
    </Animated.View>

    {/* ---- desk ---- */}
    <View pointerEvents="none" style={[rd.desk,{height:deskH}]}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:20+i*22,height:2,backgroundColor:'rgba(70,30,5,0.18)'}}/>)}</View>

    <View pointerEvents="none" style={{position:'absolute',left:-8,bottom:deskH-34}}>
      {[['Unlock','#7a3fd0','brain',0],['Solve','#2f6fd8','gear',6],['Think','#f0a020','bulb',-4]].map(([t,c,k,ml]:any)=>
        <View key={t} style={[rd.book,{backgroundColor:c,width:bookW,height:bookH,marginLeft:ml}]}>
          <View style={rd.bookIc}><BookIcon k={k}/></View>
          <Text style={rd.bookt}>{t}</Text>
          <View style={rd.bookPg}/>
        </View>)}
    </View>

    <View pointerEvents="none" style={[rd.cup,{bottom:deskH-34}]}>
      <View style={[rd.pen,{backgroundColor:'#3a8be0',left:12,height:64,transform:[{rotate:'-16deg'}]}]}/>
      <View style={[rd.pen,{backgroundColor:'#f6b928',left:32,height:74,transform:[{rotate:'-4deg'}]}]}/>
      <View style={[rd.pen,{backgroundColor:'#ee5a8a',left:52,height:80,transform:[{rotate:'10deg'}]}]}/>
      <View style={rd.cupBody}><Smiley w={40} c="#1c2350"/></View>
    </View>

    {/* ---- top bar ---- */}
    <View style={rd.top}>
      <TouchableOpacity onPress={onHome} style={[rd.tb,{borderColor:'#3aa6ff'}]}><WIcon n="home"/></TouchableOpacity>
      <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="gear"/></TouchableOpacity>
      <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="dots"/></TouchableOpacity>
      <View style={{flex:1}}/>
      <View style={rd.cpill}><Coin s={24}/><Text style={rd.cnum}>{hints}</Text><View style={rd.cplus}><Text style={rd.cplust}>+</Text></View></View>
    </View>
  </Stage>}

const rd=StyleSheet.create({
  window:{position:'absolute',right:-6,width:70,height:290,backgroundColor:'rgba(43,86,200,0.55)',borderWidth:4,borderColor:'#3a2a8a'},
  winV:{position:'absolute',left:'48%',top:0,bottom:0,width:4,backgroundColor:'#3a2a8a'},
  winH:{position:'absolute',left:0,right:0,top:'34%',height:4,backgroundColor:'#3a2a8a'},
  shelf:{position:'absolute',left:0,right:0,flexDirection:'row',alignItems:'flex-end',justifyContent:'center',opacity:0.35},
  lamp:{position:'absolute',top:0,alignItems:'center'},
  plant:{position:'absolute',left:-18},
  top:{position:'absolute',top:34,left:0,right:0,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10},
  tb:{width:44,height:44,borderRadius:22,backgroundColor:'#1a2a6a',borderWidth:3,alignItems:'center',justifyContent:'center'},
  cpill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#241a6e',borderWidth:3,borderColor:'#6a4fe0',borderRadius:24,paddingHorizontal:10,height:44},
  cnum:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#fff',minWidth:16,textAlign:'center'},
  cplus:{width:26,height:26,borderRadius:13,backgroundColor:'#2fc24a',alignItems:'center',justifyContent:'center'},
  cplust:{color:'#fff',fontWeight:'900',fontSize:18,lineHeight:22},
  // FIX: StyleSheet.absoluteFillObject removed -> explicit absolute fill
  nbIn:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#f7efdd',borderRadius:20,overflow:'hidden',borderBottomWidth:6,borderBottomColor:'#d9cdb0'},
  ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e7dcc2'},
  rings:{position:'absolute',top:-14,left:0,right:0,flexDirection:'row',justifyContent:'space-around',paddingHorizontal:16},
  ring:{width:12,height:34,borderRadius:6,backgroundColor:'#1c2350',borderWidth:2,borderColor:'#4a5ac0'},
  content:{flex:1,alignItems:'center',paddingHorizontal:14},
  qBlob:{backgroundColor:'#dcd6f5',borderRadius:30,paddingHorizontal:18,alignItems:'center'},
  q:{fontFamily:F,fontWeight:'900',color:'#1c2350',textAlign:'center'},
  btnOuter:{backgroundColor:'#0f5a2a',borderRadius:42,padding:4,elevation:6,shadowColor:'#000',shadowOpacity:0.3,shadowRadius:5,shadowOffset:{width:0,height:4}},
  btnIn:{backgroundColor:'#34c73c',borderRadius:38,paddingHorizontal:38,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden'},
  btnShine:{position:'absolute',top:4,left:20,right:20,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.35)'},
  btnt:{fontFamily:F,fontSize:38,fontWeight:'900',color:'#fff',textShadowColor:'rgba(0,60,20,0.6)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
  lvBtnOuter:{backgroundColor:'#1a3f86',borderRadius:30,padding:3,elevation:4},
  lvBtnIn:{backgroundColor:'#3a8be0',borderRadius:27,paddingHorizontal:30,paddingVertical:8,flexDirection:'row',alignItems:'center',gap:10},
  lvBtnT:{fontFamily:F,fontSize:24,fontWeight:'900',color:'#fff'},
  err:{color:'#d63a5a',marginTop:12,fontFamily:F,fontSize:14,textAlign:'center'},
  tsg:{position:'absolute',left:14,bottom:14,fontFamily:F,fontSize:16,fontStyle:'italic',fontWeight:'bold',color:'#6a5fd0',lineHeight:20,transform:[{rotate:'-8deg'}]},
  lvTag:{position:'absolute',top:-16,right:14,backgroundColor:'#5b4fe0',paddingHorizontal:16,paddingVertical:6,borderRadius:6},
  lvt:{fontFamily:F,fontSize:22,fontWeight:'900',color:'#fff'},
  desk:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#b0622a',borderTopWidth:5,borderTopColor:'#d98b4a'},
  book:{borderRadius:6,flexDirection:'row',alignItems:'center',paddingLeft:14,marginTop:2,borderBottomWidth:4,borderBottomColor:'rgba(0,0,0,0.25)'},
  bookIc:{width:30,height:30,borderRadius:15,borderWidth:2,borderColor:'rgba(255,255,255,0.6)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.12)'},
  bookt:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',marginLeft:10,flex:1},
  bookPg:{width:26,height:26,borderRadius:4,marginRight:10,borderWidth:2,borderColor:'rgba(255,255,255,0.35)'},
  cup:{position:'absolute',right:-6,width:90,height:132},
  pen:{position:'absolute',top:0,width:11,borderRadius:3,borderTopLeftRadius:6,borderTopRightRadius:6},
  cupBody:{position:'absolute',bottom:0,left:0,right:0,height:74,backgroundColor:'#f7f5ee',borderRadius:10,borderWidth:3,borderColor:'#d8d4c8',alignItems:'center',justifyContent:'center'}});