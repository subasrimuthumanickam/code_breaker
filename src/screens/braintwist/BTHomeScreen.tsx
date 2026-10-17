// // // import React,{useEffect,useRef} from 'react';
// // // import {View,Text,TouchableOpacity,Animated,StyleSheet,useWindowDimensions} from 'react-native';
// // // import Svg,{Rect,Path,Circle,Polygon,Line,G,Ellipse} from 'react-native-svg';
// // // import {F,Stage,Coin,Smiley,loop,useStageW} from './BTShared';

// // // const WIcon=({n}:any)=><Svg width={22} height={22} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#fff"/>
// // //   :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2.6" fill="none"/></G>
// // //   :<G><Circle cx="5" cy="12" r="2" fill="#fff"/><Circle cx="12" cy="12" r="2" fill="#fff"/><Circle cx="19" cy="12" r="2" fill="#fff"/></G>}</Svg>;

// // // // winking brain mascot with glasses, pointing finger
// // // const BrainMascot=({w}:any)=><Svg width={w} height={w*0.85} viewBox="0 0 200 170">
// // //   <Path d="M118 142 Q140 152 152 132" stroke="#1c2b4a" strokeWidth="7" fill="none" strokeLinecap="round"/>
// // //   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
// // //     <Circle key={'o'+i} cx={x} cy={y} r={r} fill="#f58fa6" stroke="#e0607f" strokeWidth="5"/>)}
// // //   {[[62,58,28],[100,44,30],[138,58,28],[48,92,26],[152,92,26],[100,86,42],[72,118,26],[128,118,26]].map(([x,y,r]:any,i)=>
// // //     <Circle key={'f'+i} cx={x} cy={y} r={r-1} fill="#f58fa6"/>)}
// // //   <Path d="M78 48 Q90 58 82 70 M120 46 Q110 58 120 68 M58 88 Q70 94 64 106 M144 88 Q132 96 138 108" stroke="#e0607f" strokeWidth="3" fill="none" strokeLinecap="round"/>
// // //   <Line x1="60" y1="90" x2="42" y2="86" stroke="#1c2b4a" strokeWidth="5" strokeLinecap="round"/>
// // //   <Circle cx="78" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
// // //   <Circle cx="124" cy="92" r="19" fill="#fff" fillOpacity="0.2" stroke="#1c2b4a" strokeWidth="5"/>
// // //   <Path d="M97 90 Q101 86 105 90" stroke="#1c2b4a" strokeWidth="5" fill="none"/>
// // //   <Circle cx="80" cy="93" r="12" fill="#fff"/><Circle cx="82" cy="94" r="7.5" fill="#1c2b4a"/><Circle cx="84" cy="91" r="2.6" fill="#fff"/>
// // //   <Path d="M113 95 Q124 82 135 95" stroke="#1c2b4a" strokeWidth="5" fill="none" strokeLinecap="round"/>
// // //   <Circle cx="64" cy="112" r="7" fill="#ff7a96" opacity="0.7"/><Circle cx="140" cy="112" r="7" fill="#ff7a96" opacity="0.7"/>
// // //   <Path d="M88 116 Q101 136 114 116 Z" fill="#c0304f" stroke="#1c2b4a" strokeWidth="3" strokeLinejoin="round"/>
// // //   <Path d="M94 125 Q101 132 108 125 Q101 121 94 125Z" fill="#ff8aa0"/>
// // //   <Circle cx="152" cy="132" r="14" fill="#fff" stroke="#1c2b4a" strokeWidth="3"/>
// // //   <Rect x="146" y="106" width="11" height="30" rx="5.5" fill="#fff" stroke="#1c2b4a" strokeWidth="3" transform="rotate(-12 151 121)"/>
// // // </Svg>;

// // // const BulbDoodle=({w,smile}:any)=><Svg width={w} height={w} viewBox="0 0 50 50">
// // //   <Path d="M25 8 C15 8 11 16 14 23 C16 27 18 29 18 33 H32 C32 29 34 27 36 23 C39 16 35 8 25 8Z" stroke="#a79ee0" strokeWidth="1.8" fill="none"/>
// // //   <Path d="M19 37 H31 M21 41 H29" stroke="#a79ee0" strokeWidth="1.8" strokeLinecap="round"/>
// // //   <Path d="M25 2V4 M8 10 L10 12 M42 10 L40 12 M3 24 H6 M44 24 H47" stroke="#a79ee0" strokeWidth="1.6" strokeLinecap="round"/>
// // //   {smile&&<><Circle cx="21" cy="20" r="1.2" fill="#a79ee0"/><Circle cx="29" cy="20" r="1.2" fill="#a79ee0"/><Path d="M20 25 Q25 29 30 25" stroke="#a79ee0" strokeWidth="1.5" fill="none"/></>}</Svg>;
// // // const TinyStar=({w}:any)=><Svg width={w} height={w} viewBox="0 0 50 50"><Polygon points="25,6 31,19 45,20 34,30 38,44 25,36 12,44 16,30 5,20 19,19" stroke="#b9b1ea" strokeWidth="2" fill="none" strokeLinejoin="round"/></Svg>;
// // // const BookIcon=({k}:any)=><Svg width={24} height={24} viewBox="0 0 24 24">{k==='brain'?<G><Circle cx="9" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Circle cx="15" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M12 6 V19" stroke="#fff" strokeWidth="1.8"/></G>
// // //   :k==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="3.6" strokeDasharray="2.8 3.2" fill="none"/><Circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2" fill="none"/></G>
// // //   :<G><Path d="M12 3 C7 3 5 8 7 11 C8.5 13 9 14 9 16 H15 C15 14 15.5 13 17 11 C19 8 17 3 12 3Z" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M9.5 19 H14.5 M10.5 21.5 H13.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></G>}</Svg>;

// // // export default function BTHomeScreen({hints,n,onHome,onGo,err}:any){
// // //   const sw=useStageW(),{height:H}=useWindowDimensions();
// // //   // ---- responsive sizes (this is the mobile fix) ----
// // //   const compact=H<700,deskH=compact?70:96,bookH=compact?38:46,bookW=Math.round(Math.min(200,sw*0.46));
// // //   const NBW=sw-48,nbTop=compact?170:186,nbBottom=deskH-34+3*(bookH+2)+8;
// // //   const mw=Math.round(Math.min(170,NBW*0.44)),mh=mw*0.85,qFs=Math.floor(Math.min(28,(NBW-80)/11.2));
// // //   const padTop=Math.round(mh*0.3)+50;

// // //   const enter=useRef(new Animated.Value(0)).current,brainIn=useRef(new Animated.Value(0)).current,
// // //     fl=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current,
// // //     pu=useRef(new Animated.Value(0)).current,gl=useRef(new Animated.Value(0)).current;
// // //   useEffect(()=>{
// // //     Animated.sequence([
// // //       Animated.spring(enter,{toValue:1,friction:6,tension:60,useNativeDriver:true}),
// // //       Animated.spring(brainIn,{toValue:1,friction:4,tension:80,useNativeDriver:true})]).start();
// // //     loop(fl,1100);loop(tw,700);loop(pu,800);loop(gl,1800);
// // //   },[]);
// // //   const nbY=enter.interpolate({inputRange:[0,1],outputRange:[80,0]});
// // //   const flY=fl.interpolate({inputRange:[0,1],outputRange:[0,-9]});
// // //   const flR=fl.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
// // //   const brS=brainIn.interpolate({inputRange:[0,1],outputRange:[0.3,1]});
// // //   const twO=tw.interpolate({inputRange:[0,1],outputRange:[0.25,1]});
// // //   const puS=pu.interpolate({inputRange:[0,1],outputRange:[1,1.06]});
// // //   const glO=gl.interpolate({inputRange:[0,1],outputRange:[0.06,0.16]});
// // //   const spark=(style:any,rot:string)=><Animated.View pointerEvents="none" style={[{position:'absolute',width:20,height:5,borderRadius:3,backgroundColor:'#ffd21f',opacity:twO,transform:[{rotate:rot}]},style]}/>;

// // //   return <Stage bg="#1a1445">
// // //     {/* ---- room ---- */}
// // //     <View pointerEvents="none" style={[rd.window,{top:nbTop-10}]}><View style={rd.winV}/><View style={rd.winH}/><View style={[rd.winH,{top:'72%'}]}/></View>
// // //     <View pointerEvents="none" style={[rd.shelf,{bottom:deskH}]}>{[['#3b2a8a',26],['#2a5a9a',20],['#7a3a8a',24],['#2a4a8a',18],['#5a3a9a',22],['#2a6a8a',20]].map(([c,w]:any,i)=><View key={i} style={{width:w,height:46+(i%3)*10,backgroundColor:c,marginRight:3,borderTopLeftRadius:3,borderTopRightRadius:3}}/>)}</View>
// // //     <View pointerEvents="none" style={[rd.lamp,{left:sw*0.6}]}>
// // //       <View style={{width:2,height:46,backgroundColor:'#2a2260'}}/>
// // //       <Svg width={70} height={32} viewBox="0 0 74 34"><Path d="M8 34 Q8 6 37 6 Q66 6 66 34 Z" fill="#4a2fa0"/><Path d="M14 30 Q14 12 37 12" stroke="#7a5cf0" strokeWidth="3" fill="none"/></Svg>
// // //       <Animated.View style={{position:'absolute',top:62,width:110,height:110,borderRadius:55,backgroundColor:'#ffcf70',opacity:glO}}/>
// // //     </View>
// // //     <View pointerEvents="none" style={[rd.plant,{bottom:deskH+10}]}>
// // //       <Svg width={80} height={130} viewBox="0 0 90 150">
// // //         <Path d="M10 150 Q8 110 20 90" stroke="#1f6a2e" strokeWidth="4" fill="none"/>
// // //         <Ellipse cx="22" cy="86" rx="12" ry="26" fill="#2fa43f" transform="rotate(20 22 86)"/>
// // //         <Ellipse cx="40" cy="104" rx="11" ry="24" fill="#3fbf4e" transform="rotate(60 40 104)"/>
// // //         <Ellipse cx="12" cy="112" rx="10" ry="22" fill="#27903a" transform="rotate(-25 12 112)"/>
// // //       </Svg>
// // //     </View>

// // //     {/* ---- notebook ---- */}
// // //     <Animated.View style={{position:'absolute',left:24,width:NBW,top:nbTop,bottom:nbBottom,opacity:enter,transform:[{translateY:nbY}]}}>
// // //       <View style={rd.nbIn}>
// // //         {Array.from({length:14},(_,i)=><View key={i} style={[rd.ln,{top:90+i*34}]}/>)}
// // //         <View style={{position:'absolute',left:14,top:84}}><BulbDoodle w={40}/></View>
// // //         <View style={{position:'absolute',left:10,top:170}}><TinyStar w={20}/></View>
// // //         <View style={{position:'absolute',right:16,top:150}}><TinyStar w={20}/></View>
// // //         <View style={{position:'absolute',right:14,bottom:12}}><BulbDoodle w={46} smile/></View>
// // //         <Text style={rd.tsg}>{'Think\nSolve\nGrow ♡'}</Text>

// // //         <View style={[rd.content,{paddingTop:padTop}]}>
// // //           <View style={[rd.qBlob,{paddingVertical:compact?8:12}]}>
// // //             <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>ARE YOU READY TO</Text>
// // //             <Text allowFontScaling={false} numberOfLines={1} style={[rd.q,{fontSize:qFs,lineHeight:Math.round(qFs*1.3)}]}>TEST YOUR BRAIN?</Text>
// // //           </View>
// // //           <Svg width={Math.min(230,NBW-80)} height={14} viewBox="0 0 230 14" style={{marginTop:4}}><Path d="M4 10 Q60 2 118 7 Q170 11 226 4" stroke="#f5c518" strokeWidth="4.5" fill="none" strokeLinecap="round"/></Svg>

// // //           <Animated.View style={{marginTop:compact?26:38,transform:[{scale:puS}]}}>
// // //             <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
// // //               <View style={rd.btnShine}/>
// // //               <Svg width={30} height={30} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg>
// // //               <Text style={rd.btnt}>READY</Text>
// // //             </View></TouchableOpacity>
// // //             {spark({right:-26,top:8},'-35deg')}{spark({right:-30,top:28},'0deg')}{spark({right:-24,top:48},'35deg')}
// // //           </Animated.View>
// // //           {!!err&&<Text style={rd.err}>{err}</Text>}
// // //         </View>
// // //       </View>

// // //       <View pointerEvents="none" style={rd.rings}>{Array.from({length:9},(_,i)=><View key={i} style={rd.ring}/>)}</View>

// // //       <Animated.View pointerEvents="none" style={[rd.lvTag,{opacity:brainIn,transform:[{rotate:'-2deg'},{scale:brS}]}]}>
// // //         <Text style={rd.lvt}>{'LEVEL '}<Text style={{color:'#ffd21f'}}>{n}</Text></Text></Animated.View>

// // //       <Animated.View pointerEvents="none" style={{position:'absolute',top:-mh*0.68,left:14,transform:[{translateY:flY},{rotate:flR},{scale:brS}]}}>
// // //         <BrainMascot w={mw}/>
// // //       </Animated.View>
// // //       {spark({left:mw+16,top:-mh*0.6},'60deg')}{spark({left:mw+24,top:-mh*0.4},'20deg')}
// // //     </Animated.View>

// // //     {/* ---- desk ---- */}
// // //     <View pointerEvents="none" style={[rd.desk,{height:deskH}]}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:0,right:0,top:20+i*22,height:2,backgroundColor:'rgba(70,30,5,0.18)'}}/>)}</View>

// // //     <View pointerEvents="none" style={{position:'absolute',left:-8,bottom:deskH-34}}>
// // //       {[['Unlock','#7a3fd0','brain',0],['Solve','#2f6fd8','gear',6],['Think','#f0a020','bulb',-4]].map(([t,c,k,ml]:any)=>
// // //         <View key={t} style={[rd.book,{backgroundColor:c,width:bookW,height:bookH,marginLeft:ml}]}>
// // //           <View style={rd.bookIc}><BookIcon k={k}/></View>
// // //           <Text style={rd.bookt}>{t}</Text>
// // //           <View style={rd.bookPg}/>
// // //         </View>)}
// // //     </View>

// // //     <View pointerEvents="none" style={[rd.cup,{bottom:deskH-34}]}>
// // //       <View style={[rd.pen,{backgroundColor:'#3a8be0',left:12,height:64,transform:[{rotate:'-16deg'}]}]}/>
// // //       <View style={[rd.pen,{backgroundColor:'#f6b928',left:32,height:74,transform:[{rotate:'-4deg'}]}]}/>
// // //       <View style={[rd.pen,{backgroundColor:'#ee5a8a',left:52,height:80,transform:[{rotate:'10deg'}]}]}/>
// // //       <View style={rd.cupBody}><Smiley w={40} c="#1c2350"/></View>
// // //     </View>

// // //     {/* ---- top bar ---- */}
// // //     <View style={rd.top}>
// // //       <TouchableOpacity onPress={onHome} style={[rd.tb,{borderColor:'#3aa6ff'}]}><WIcon n="home"/></TouchableOpacity>
// // //       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="gear"/></TouchableOpacity>
// // //       <TouchableOpacity style={[rd.tb,{borderColor:'#8a6cf5'}]}><WIcon n="dots"/></TouchableOpacity>
// // //       <View style={{flex:1}}/>
// // //       <View style={rd.cpill}><Coin s={24}/><Text style={rd.cnum}>{hints}</Text><View style={rd.cplus}><Text style={rd.cplust}>+</Text></View></View>
// // //     </View>
// // //   </Stage>}

// // // const rd=StyleSheet.create({
// // //   window:{position:'absolute',right:-6,width:70,height:290,backgroundColor:'rgba(43,86,200,0.55)',borderWidth:4,borderColor:'#3a2a8a'},
// // //   winV:{position:'absolute',left:'48%',top:0,bottom:0,width:4,backgroundColor:'#3a2a8a'},
// // //   winH:{position:'absolute',left:0,right:0,top:'34%',height:4,backgroundColor:'#3a2a8a'},
// // //   shelf:{position:'absolute',left:0,right:0,flexDirection:'row',alignItems:'flex-end',justifyContent:'center',opacity:0.35},
// // //   lamp:{position:'absolute',top:0,alignItems:'center'},
// // //   plant:{position:'absolute',left:-18},
// // //   top:{position:'absolute',top:34,left:0,right:0,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10},
// // //   tb:{width:44,height:44,borderRadius:22,backgroundColor:'#1a2a6a',borderWidth:3,alignItems:'center',justifyContent:'center'},
// // //   cpill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#241a6e',borderWidth:3,borderColor:'#6a4fe0',borderRadius:24,paddingHorizontal:10,height:44},
// // //   cnum:{fontFamily:F,fontSize:20,fontWeight:'900',color:'#fff',minWidth:16,textAlign:'center'},
// // //   cplus:{width:26,height:26,borderRadius:13,backgroundColor:'#2fc24a',alignItems:'center',justifyContent:'center'},
// // //   cplust:{color:'#fff',fontWeight:'900',fontSize:18,lineHeight:22},
// // //   nbIn:{...StyleSheet.absoluteFillObject,backgroundColor:'#f7efdd',borderRadius:20,overflow:'hidden',borderBottomWidth:6,borderBottomColor:'#d9cdb0'},
// // //   ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#e7dcc2'},
// // //   rings:{position:'absolute',top:-14,left:0,right:0,flexDirection:'row',justifyContent:'space-around',paddingHorizontal:16},
// // //   ring:{width:12,height:34,borderRadius:6,backgroundColor:'#1c2350',borderWidth:2,borderColor:'#4a5ac0'},
// // //   content:{flex:1,alignItems:'center',paddingHorizontal:14},
// // //   qBlob:{backgroundColor:'#dcd6f5',borderRadius:30,paddingHorizontal:18,alignItems:'center'},
// // //   q:{fontFamily:F,fontWeight:'900',color:'#1c2350',textAlign:'center'},
// // //   btnOuter:{backgroundColor:'#0f5a2a',borderRadius:42,padding:4,elevation:6,shadowColor:'#000',shadowOpacity:0.3,shadowRadius:5,shadowOffset:{width:0,height:4}},
// // //   btnIn:{backgroundColor:'#34c73c',borderRadius:38,paddingHorizontal:38,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden'},
// // //   btnShine:{position:'absolute',top:4,left:20,right:20,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.35)'},
// // //   btnt:{fontFamily:F,fontSize:38,fontWeight:'900',color:'#fff',textShadowColor:'rgba(0,60,20,0.6)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
// // //   err:{color:'#d63a5a',marginTop:12,fontFamily:F,fontSize:14,textAlign:'center'},
// // //   tsg:{position:'absolute',left:14,bottom:14,fontFamily:F,fontSize:16,fontStyle:'italic',fontWeight:'bold',color:'#6a5fd0',lineHeight:20,transform:[{rotate:'-8deg'}]},
// // //   lvTag:{position:'absolute',top:-16,right:14,backgroundColor:'#5b4fe0',paddingHorizontal:16,paddingVertical:6,borderRadius:6},
// // //   lvt:{fontFamily:F,fontSize:22,fontWeight:'900',color:'#fff'},
// // //   desk:{position:'absolute',left:0,right:0,bottom:0,backgroundColor:'#b0622a',borderTopWidth:5,borderTopColor:'#d98b4a'},
// // //   book:{borderRadius:6,flexDirection:'row',alignItems:'center',paddingLeft:14,marginTop:2,borderBottomWidth:4,borderBottomColor:'rgba(0,0,0,0.25)'},
// // //   bookIc:{width:30,height:30,borderRadius:15,borderWidth:2,borderColor:'rgba(255,255,255,0.6)',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.12)'},
// // //   bookt:{fontFamily:F,fontSize:19,fontWeight:'bold',color:'#fff',marginLeft:10,flex:1},
// // //   bookPg:{width:26,height:26,borderRadius:4,marginRight:10,borderWidth:2,borderColor:'rgba(255,255,255,0.35)'},
// // //   cup:{position:'absolute',right:-6,width:90,height:132},
// // //   pen:{position:'absolute',top:0,width:11,borderRadius:3,borderTopLeftRadius:6,borderTopRightRadius:6},
// // //   cupBody:{position:'absolute',bottom:0,left:0,right:0,height:74,backgroundColor:'#f7f5ee',borderRadius:10,borderWidth:3,borderColor:'#d8d4c8',alignItems:'center',justifyContent:'center'}});
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
// //   // FIX: StyleSheet.absoluteFillObject removed -> explicit absolute fill
// //   nbIn:{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#f7efdd',borderRadius:20,overflow:'hidden',borderBottomWidth:6,borderBottomColor:'#d9cdb0'},
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

// export default function BTHomeScreen({hints,n,onHome,onGo,onLevels,err}:any){
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

//           <Animated.View style={{marginTop:compact?16:26,transform:[{scale:puS}]}}>
//             <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={rd.btnOuter}><View style={rd.btnIn}>
//               <View style={rd.btnShine}/>
//               <Svg width={30} height={30} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff"/></Svg>
//               <Text style={rd.btnt}>READY</Text>
//             </View></TouchableOpacity>
//             {spark({right:-26,top:8},'-35deg')}{spark({right:-30,top:28},'0deg')}{spark({right:-24,top:48},'35deg')}
//           </Animated.View>
//           <TouchableOpacity onPress={onLevels} activeOpacity={0.85} style={[rd.lvBtnOuter,{marginTop:compact?14:20}]}><View style={rd.lvBtnIn}>
//             <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></Svg>
//             <Text style={rd.lvBtnT}>LEVELS</Text>
//           </View></TouchableOpacity>
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
//   lvBtnOuter:{backgroundColor:'#1a3f86',borderRadius:30,padding:3,elevation:4},
//   lvBtnIn:{backgroundColor:'#3a8be0',borderRadius:27,paddingHorizontal:30,paddingVertical:8,flexDirection:'row',alignItems:'center',gap:10},
//   lvBtnT:{fontFamily:F,fontSize:24,fontWeight:'900',color:'#fff'},
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
import {View,Text,TouchableOpacity,Animated,Easing,StyleSheet,useWindowDimensions} from 'react-native';
import Svg,{Rect,Path,Circle,Polygon,G} from 'react-native-svg';
import {F,Stage,Coin,useStageW} from './BTShared';

const NAVY='#10245e',PURPLE='#7a2fd0',SKY='#3f9cf0';

// local ping-pong loop (native driver) used by all the animations
const yoyo=(v:Animated.Value,ms:number)=>Animated.loop(Animated.sequence([
  Animated.timing(v,{toValue:1,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
  Animated.timing(v,{toValue:0,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true})])).start();

/* ---------- small svg art ---------- */
const WIcon=({n}:any)=><Svg width={24} height={24} viewBox="0 0 24 24">{n==='home'?<Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill="#7a4118"/>
  :n==='gear'?<G><Circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="4" strokeDasharray="3 3.3" fill="none"/><Circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2.6" fill="none"/></G>
  :<G><Circle cx="5" cy="12" r="2.2" fill="#fff"/><Circle cx="12" cy="12" r="2.2" fill="#fff"/><Circle cx="19" cy="12" r="2.2" fill="#fff"/></G>}</Svg>;

const StarSvg=({w,fill='#ffd93a',stroke='#f0b020'}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
  <Polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill={fill} stroke={stroke} strokeWidth="6" strokeLinejoin="round"/>
  <Polygon points="50,22 58,40 76,42 62,54 67,72 50,62 33,72 38,54 24,42 42,40" fill="#ffe98a"/></Svg>;

const Balloon=()=><Svg width={64} height={92} viewBox="0 0 64 92">
  <Path d="M32 2 C8 2 2 26 10 42 C16 52 24 58 24 62 H40 C40 58 48 52 54 42 C62 26 56 2 32 2Z" fill="#f4a23a"/>
  <Path d="M32 2 C20 8 18 40 24 62 H40 C46 40 44 8 32 2Z" fill="#f7d34a"/>
  <Path d="M32 2 C26 14 26 46 28 62 H36 C38 46 38 14 32 2Z" fill="#ef5a4c"/>
  <Path d="M24 62 L26 74 M40 62 L38 74" stroke="#7a4a2a" strokeWidth="2"/>
  <Rect x="25" y="74" width="14" height="12" rx="2" fill="#b9773a"/></Svg>;

const Rocket=()=><Svg width={64} height={96} viewBox="0 0 64 96">
  <Path d="M32 96 C22 84 26 74 32 66 C38 74 42 84 32 96Z" fill="#ff9a2e"/>
  <Path d="M32 90 C27 82 29 76 32 72 C35 76 37 82 32 90Z" fill="#ffd93a"/>
  <Path d="M14 56 L2 76 L18 68Z" fill="#ef4b6a"/><Path d="M50 56 L62 76 L46 68Z" fill="#ef4b6a"/>
  <Path d="M32 4 C48 18 48 50 44 68 H20 C16 50 16 18 32 4Z" fill="#fff" stroke="#d9e2f2" strokeWidth="2"/>
  <Path d="M32 4 C40 11 44 20 45 28 H19 C20 20 24 11 32 4Z" fill="#ef4b6a"/>
  <Circle cx="32" cy="44" r="9" fill="#3b8fe8" stroke="#1c4a9a" strokeWidth="3"/></Svg>;

// arrow-shaped signpost board (s = scale, smaller on short phones)
const Arrow=({w,c,t,k,s}:any)=><View style={{width:w,height:42*s,marginBottom:6*s}}>
  <Svg width={w} height={42*s} viewBox={`0 0 ${w} 42`} preserveAspectRatio="none" style={{position:'absolute'}}>
    <Path d={`M6 2 H${w-20} L${w-2} 21 L${w-20} 40 H6 Q2 40 2 36 V6 Q2 2 6 2Z`} fill={c} stroke="rgba(0,0,0,0.25)" strokeWidth="2"/>
    <Path d={`M8 6 H${w-24}`} stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"/></Svg>
  <View style={{flexDirection:'row',alignItems:'center',height:42*s,paddingLeft:12*s}}>
    <Svg width={22*s} height={22*s} viewBox="0 0 24 24">{k==='bulb'?<G><Path d="M12 3 C7 3 5 8 7 11 C8.5 13 9 14 9 16 H15 C15 14 15.5 13 17 11 C19 8 17 3 12 3Z" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M9.5 19 H14.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></G>
      :k==='brain'?<G><Circle cx="9" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Circle cx="15" cy="10" r="5" stroke="#fff" strokeWidth="1.8" fill="none"/><Path d="M12 6 V19" stroke="#fff" strokeWidth="1.8"/></G>
      :<Path d="M4 20 C4 10 10 4 20 4 C20 14 14 20 4 20Z M4 20 L14 10" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/>}</Svg>
    <Text style={{fontFamily:F,fontSize:19*s,fontWeight:'bold',color:'#fff',marginLeft:8*s}}>{t}</Text></View></View>;

const Leaf=({l,b,w,h,r,c}:any)=><View style={{position:'absolute',left:l,bottom:b,width:w,height:h,borderRadius:h/2,backgroundColor:c||'#5fae3a',transform:[{rotate:r+'deg'}]}}/>;
const Tree=({l,b,s}:any)=><View style={{position:'absolute',left:l,bottom:b,alignItems:'center'}}>
  <View style={{width:s,height:s,borderRadius:s/2,backgroundColor:'#4fb04a'}}/><View style={{position:'absolute',left:s*0.35,top:-s*0.25,width:s*0.7,height:s*0.7,borderRadius:s*0.35,backgroundColor:'#62c24a'}}/>
  <View style={{width:s*0.16,height:s*0.4,backgroundColor:'#8a5a2a',marginTop:-2}}/></View>;

/* ---------- animated pieces ---------- */
// init = starting point (0..1) so clouds are already visible when the screen opens
const DriftCloud=({W,top,scale,ms,init,tint}:any)=>{
  const p=useRef(new Animated.Value(init)).current;
  useEffect(()=>{Animated.sequence([
    Animated.timing(p,{toValue:1,duration:Math.max(1,ms*(1-init)),easing:Easing.linear,useNativeDriver:true}),
    Animated.loop(Animated.timing(p,{toValue:1,duration:ms,easing:Easing.linear,useNativeDriver:true}))]).start()},[]);
  const c=tint||'rgba(255,255,255,0.95)';
  return <Animated.View pointerEvents="none" style={{position:'absolute',top,transform:[{translateX:p.interpolate({inputRange:[0,1],outputRange:[-200,W+200]})},{scale}]}}>
    <View style={{width:130,height:34,borderRadius:17,backgroundColor:c}}/>
    <View style={{position:'absolute',left:14,top:-18,width:46,height:46,borderRadius:23,backgroundColor:c}}/>
    <View style={{position:'absolute',left:46,top:-30,width:62,height:62,borderRadius:31,backgroundColor:c}}/>
    <View style={{position:'absolute',left:88,top:-14,width:40,height:40,borderRadius:20,backgroundColor:c}}/></Animated.View>};

const Twinkle=({x,y,w,delay}:any)=>{
  const p=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.sequence([Animated.delay(delay),Animated.loop(Animated.sequence([
    Animated.timing(p,{toValue:1,duration:900,useNativeDriver:true}),Animated.timing(p,{toValue:0,duration:900,useNativeDriver:true})]))]).start()},[]);
  return <Animated.View pointerEvents="none" style={{position:'absolute',left:x,top:y,opacity:p.interpolate({inputRange:[0,1],outputRange:[0.6,1]}),
    transform:[{scale:p.interpolate({inputRange:[0,1],outputRange:[0.85,1.15]})},{rotate:p.interpolate({inputRange:[0,1],outputRange:['-12deg','12deg']})}]}}><StarSvg w={w}/></Animated.View>};

/* The whole scene is drawn at FULL window width (W).
   Everything that belongs near the phone-sized column is placed relative to
   cx (column left) and cw (column width), so on a website the sides are filled
   with sky / clouds / meadow instead of flat blue, and on mobile cx=0, cw=W. */
function SkyWorld({W,H,cx,cw,wide,ps,sb}:any){
  const fl=useRef(new Animated.Value(0)).current,rk=useRef(new Animated.Value(0)).current,wf=useRef(new Animated.Value(0)).current,bs=useRef(new Animated.Value(0)).current,sw=useRef(new Animated.Value(0)).current;
  useEffect(()=>{yoyo(fl,2600);yoyo(rk,1700);yoyo(wf,700);yoyo(bs,1500);yoyo(sw,3000)},[]);
  const balY=fl.interpolate({inputRange:[0,1],outputRange:[0,-14]}),balR=fl.interpolate({inputRange:[0,1],outputRange:['-4deg','4deg']}),
    rkY=rk.interpolate({inputRange:[0,1],outputRange:[0,-10]}),rkX=rk.interpolate({inputRange:[0,1],outputRange:[0,8]}),
    wfO=wf.interpolate({inputRange:[0,1],outputRange:[0.55,1]}),
    bigR=bs.interpolate({inputRange:[0,1],outputRange:['-8deg','8deg']}),bigS=bs.interpolate({inputRange:[0,1],outputRange:[1,1.08]}),
    swayR=sw.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
  const X=(f:number)=>cx+cw*f,cliffTop=H*0.4,R=cx+cw;       // R = right edge of the column
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {/* sky */}
    <View style={{position:'absolute',left:0,right:0,top:0,height:'38%',backgroundColor:'#3f9cf0'}}/>
    <View style={{position:'absolute',left:0,right:0,top:'38%',height:'30%',backgroundColor:'#7cc8f8'}}/>
    <View style={{position:'absolute',left:0,right:0,top:'68%',bottom:0,backgroundColor:'#b4e4fb'}}/>
    <DriftCloud W={W} top={H*0.06} scale={1.1} ms={34000} init={0.35}/>
    <DriftCloud W={W} top={H*0.3} scale={0.9} ms={42000} init={0.7} tint="rgba(238,226,255,0.95)"/>
    <DriftCloud W={W} top={H*0.55} scale={1.2} ms={38000} init={0.15} />
    <DriftCloud W={W} top={H*0.72} scale={1} ms={46000} init={0.55} tint="rgba(238,226,255,0.9)"/>
    {wide&&<DriftCloud W={W} top={H*0.17} scale={0.8} ms={50000} init={0.9}/>}
    {/* balloon + rocket */}
    <Animated.View style={{position:'absolute',left:cx-8,top:H*0.13,transform:[{translateY:balY},{rotate:balR}]}}><Balloon/></Animated.View>
    <Animated.View style={{position:'absolute',left:R-70,top:H*0.12,transform:[{translateY:rkY},{translateX:rkX},{rotate:'48deg'}]}}><Rocket/></Animated.View>
    {/* stars */}
    <Twinkle x={X(0.46)} y={H*0.14} w={34} delay={0}/>
    <Twinkle x={X(0.04)} y={H*0.3} w={28} delay={500}/>
    <Twinkle x={X(0.88)} y={H*0.27} w={28} delay={900}/>
    <Twinkle x={X(0.9)} y={H*0.74} w={26} delay={300}/>
    {wide&&<><Twinkle x={cx-120} y={H*0.2} w={26} delay={200}/><Twinkle x={R+90} y={H*0.16} w={30} delay={700}/></>}
    {/* castle cliff + waterfall (at the right edge of the column) */}
    <View style={{position:'absolute',left:R-106,top:cliffTop,width:120,height:H*0.26}}>
      <View style={{position:'absolute',right:0,bottom:0,width:110,height:'92%',backgroundColor:'#d8906e',borderTopLeftRadius:34,borderBottomLeftRadius:20}}/>
      <View style={{position:'absolute',right:0,top:'8%',width:116,height:24,backgroundColor:'#6fc24a',borderTopLeftRadius:30,borderBottomLeftRadius:12}}/>
      <Animated.View style={{position:'absolute',right:18,top:'18%',width:28,height:'70%',backgroundColor:'#6fd0f5',borderRadius:10,opacity:wfO}}/>
      <View style={{position:'absolute',right:22,top:'30%',width:4,height:'40%',backgroundColor:'rgba(255,255,255,0.7)'}}/>
      <View style={{position:'absolute',right:36,top:-26,width:60,height:40,alignItems:'center'}}>
        <View style={{position:'absolute',bottom:0,width:50,height:26,backgroundColor:'#f5e4c8',borderRadius:3}}/>
        <View style={{position:'absolute',bottom:20,left:2,width:16,height:26,backgroundColor:'#f5e4c8'}}/>
        <View style={{position:'absolute',bottom:44,left:-1,width:0,height:0,borderLeftWidth:11,borderRightWidth:11,borderBottomWidth:16,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:'#ef6a4a'}}/>
        <View style={{position:'absolute',bottom:20,right:2,width:16,height:32,backgroundColor:'#f5e4c8'}}/>
        <View style={{position:'absolute',bottom:52,right:-1,width:0,height:0,borderLeftWidth:11,borderRightWidth:11,borderBottomWidth:18,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:'#f08a3a'}}/>
        <View style={{position:'absolute',bottom:70,right:10,width:2,height:12,backgroundColor:'#7a4a2a'}}/>
        <View style={{position:'absolute',bottom:76,right:-2,width:12,height:7,backgroundColor:'#ef4b4b'}}/></View>
    </View>
    {/* meadow: full-width flat band + rolling hills around the column + path + trees */}
    <View style={{position:'absolute',left:0,right:0,bottom:0,height:H*0.12,backgroundColor:'#74c843'}}/>
    {wide&&<>
      <View style={{position:'absolute',left:cx-460,bottom:-60,width:440,height:240,borderRadius:220,backgroundColor:'#6fc23f'}}/>
      <View style={{position:'absolute',left:R+20,bottom:-60,width:440,height:240,borderRadius:220,backgroundColor:'#7ccf4a'}}/>
      <Tree l={cx-150} b={H*0.1} s={42}/><Tree l={R+90} b={H*0.09} s={46}/><Tree l={cx-300} b={H*0.07} s={36}/><Tree l={R+250} b={H*0.07} s={38}/></>}
    <View style={{position:'absolute',left:cx-90,bottom:-60,width:380,height:260,borderRadius:190,backgroundColor:'#82d04c'}}/>
    <View style={{position:'absolute',left:R-290,bottom:-50,width:400,height:230,borderRadius:200,backgroundColor:'#62b83a'}}/>
    <View style={{position:'absolute',left:X(0.36),bottom:-40,width:90,height:230,borderRadius:45,backgroundColor:'#ecd29e',transform:[{rotate:'14deg'}]}}/>
    <Tree l={X(0.52)} b={H*0.07} s={34}/><Tree l={X(0.7)} b={H*0.1} s={40}/><Tree l={X(0.08)} b={H*0.2} s={44}/>
    {[[X(0.44),H*0.04,'#e58fd0'],[X(0.66),H*0.03,'#ffd93a']].map((f:any,i)=><View key={i} style={{position:'absolute',left:f[0],bottom:f[1],width:12,height:12,borderRadius:6,backgroundColor:f[2]}}/>)}
    {/* big star on rock (bottom-right of the column) */}
    <View style={{position:'absolute',left:R-96,bottom:-8,width:120,height:74,borderRadius:40,backgroundColor:'#8a6aa8'}}/>
    <Animated.View style={{position:'absolute',left:R-94,bottom:30,transform:[{rotate:bigR},{scale:bigS}]}}><StarSvg w={88}/></Animated.View>
    <Leaf l={R-70} b={10} w={22} h={50} r={-30}/><Leaf l={R-30} b={6} w={22} h={46} r={30} c="#4f9f34"/>
    {/* fence + signpost (bottom-left of the column) - raised above the bush so nothing hides it */}
    <View style={{position:'absolute',left:cx+128*ps,bottom:sb,flexDirection:'row',gap:6}}>
      {[0,1].map(i=><View key={i} style={{width:20*ps,height:(70+i*10)*ps,backgroundColor:'#c98a4a',borderTopLeftRadius:10,borderTopRightRadius:10,borderWidth:2,borderColor:'#8a5a2a',marginTop:i?0:10*ps}}/>)}</View>
    <Animated.View style={{position:'absolute',left:cx,bottom:sb,transform:[{rotate:swayR}]}}>
      <View style={{position:'absolute',left:18*ps,top:-4,width:12,height:3*48*ps+24,backgroundColor:'#9a6a3a',borderRadius:4}}/>
      <Arrow w={118*ps} c="#8a4fd8" t="Think" k="bulb" s={ps}/><Arrow w={124*ps} c="#f0a020" t="Solve" k="brain" s={ps}/><Arrow w={120*ps} c="#2f8be0" t="Grow" k="leaf" s={ps}/></Animated.View>
    {/* small foreground bush (kept low so it never covers the signs) */}
    <Leaf l={cx-24} b={-36} w={80} h={96} r={14} c="#4fb04a"/><Leaf l={cx+26} b={-42} w={60} h={78} r={-20} c="#3f9a3a"/>
  </View>}

/* ---------- screen ---------- */
export default function BTHomeScreen({hints,n,onHome,onGo,onLevels,err}:any){
  const sw=useStageW(),{width:ww,height:H}=useWindowDimensions();
  const wide=ww>sw+8,W=wide?ww:sw,cx=wide?Math.round((ww-sw)/2):0;           // website: scene is wider than the phone-sized column
  const compact=H<700,ps=compact?0.8:1,signH=Math.round(3*48*ps),sb=compact?44:56;
  const CW=sw-48;
  // card ends ABOVE the signpost (so the Think / Solve / Grow board is always visible)
  const cardTop=Math.round(H*(compact?0.24:0.22)),cardH=Math.max(270,Math.min(560,H-cardTop-(sb+signH+12)));
  const qFs=Math.floor(Math.min(30,(CW-70)/10.2));

  const enter=useRef(new Animated.Value(0)).current,signIn=useRef(new Animated.Value(0)).current,
    sway=useRef(new Animated.Value(0)).current,pu=useRef(new Animated.Value(0)).current,tw=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.sequence([
      Animated.spring(enter,{toValue:1,friction:6,tension:60,useNativeDriver:true}),
      Animated.spring(signIn,{toValue:1,friction:4,tension:80,useNativeDriver:true})]).start();
    yoyo(sway,2200);yoyo(pu,800);yoyo(tw,700);
  },[]);
  const cardY=enter.interpolate({inputRange:[0,1],outputRange:[80,0]}),
    signY=signIn.interpolate({inputRange:[0,1],outputRange:[-60,0]}),
    signR=sway.interpolate({inputRange:[0,1],outputRange:['-1.5deg','1.5deg']}),
    puS=pu.interpolate({inputRange:[0,1],outputRange:[1,1.06]}),
    twO=tw.interpolate({inputRange:[0,1],outputRange:[0.3,1]});

  const dash=(c:string,rot:string,w=18)=><Animated.View style={{width:w,height:5,borderRadius:3,backgroundColor:c,opacity:twO,marginVertical:compact?3:5,transform:[{rotate:rot}]}}/>;

  return <View style={{flex:1,backgroundColor:SKY}}>
    {/* full-window animated scene (sits behind the phone-sized column) */}
    <SkyWorld W={W} H={H} cx={cx} cw={sw} wide={wide} ps={ps} sb={sb}/>

    <Stage bg="transparent">
      {/* ---- card ---- */}
      <Animated.View style={[hm.card,{left:24,right:24,top:cardTop,height:cardH,opacity:enter,transform:[{translateY:cardY}]}]}>
        <View style={hm.cardIn}>
          <View style={[hm.content,{paddingTop:compact?44:50}]}>
            {/* question */}
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{marginRight:6}}>{dash('#ffc72c','35deg')}{dash('#ef4b4b','0deg')}{dash('#8e5be0','-35deg')}</View>
              <View style={{alignItems:'center'}}>
                <Text allowFontScaling={false} numberOfLines={1} style={[hm.q,{fontSize:qFs,color:NAVY}]}>Are you ready to</Text>
                <Text allowFontScaling={false} numberOfLines={1} style={[hm.q,{fontSize:qFs,color:PURPLE}]}>test your brain?</Text>
              </View>
              <View style={{marginLeft:6}}>{dash('#ef4b4b','-35deg')}{dash('#ffc72c','0deg')}{dash('#8e5be0','35deg')}</View>
            </View>

            {/* star divider */}
            <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
              <View style={{width:18,height:3,borderRadius:2,backgroundColor:'#b9a8ee'}}/><StarSvg w={30}/><View style={{width:18,height:3,borderRadius:2,backgroundColor:'#b9a8ee'}}/></View>

            {/* READY */}
            <Animated.View style={{transform:[{scale:puS}]}}>
              <TouchableOpacity onPress={onGo} activeOpacity={0.85} style={hm.btnOuter}><View style={[hm.btnIn,{paddingVertical:compact?8:12}]}>
                <View style={hm.btnShine}/>
                <Svg width={32} height={32} viewBox="0 0 24 24"><Polygon points="6,3 21,12 6,21" fill="#fff" stroke="#14632a" strokeWidth="1.5" strokeLinejoin="round"/></Svg>
                <Text style={[hm.btnt,{fontSize:compact?32:38}]}>READY</Text>
              </View></TouchableOpacity>
              <View style={{position:'absolute',left:-22,top:12}}>{dash('#ffc72c','-35deg',16)}{dash('#ffc72c','0deg',16)}{dash('#ffc72c','35deg',16)}</View>
              <View style={{position:'absolute',right:-22,top:12}}>{dash('#ffc72c','35deg',16)}{dash('#ffc72c','0deg',16)}{dash('#ffc72c','-35deg',16)}</View>
            </Animated.View>

            {/* LEVELS */}
            <TouchableOpacity onPress={onLevels} activeOpacity={0.85} style={hm.lvOuter}><View style={[hm.lvIn,{paddingVertical:compact?6:9}]}>
              <View style={hm.lvStitch}/>
              <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></Svg>
              <Text style={[hm.lvT,{fontSize:compact?22:26}]}>LEVELS</Text>
            </View></TouchableOpacity>
            {!!err&&<Text style={hm.err}>{err}</Text>}
          </View>
        </View>

        {/* wooden LEVEL sign */}
        <Animated.View style={[hm.signWrap,{opacity:signIn,transform:[{translateY:signY},{rotate:signR}]}]}>
          <View style={[hm.rope,{left:CW*0.2,transform:[{rotate:'8deg'}]}]}/><View style={[hm.rope,{right:CW*0.2,transform:[{rotate:'-8deg'}]}]}/>
          <View style={hm.sign}>
            <View style={[hm.leaf,{left:-16,top:4,transform:[{rotate:'-40deg'}]}]}/><View style={[hm.leaf,{left:-8,top:22,transform:[{rotate:'-75deg'}]}]}/>
            <View style={[hm.leaf,{right:-16,top:4,transform:[{rotate:'40deg'}]}]}/><View style={[hm.leaf,{right:-8,top:22,transform:[{rotate:'75deg'}]}]}/>
            <Text style={hm.lvt}>{'LEVEL '}<Text style={{color:'#ffd21f'}}>{n}</Text></Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* ---- top bar ---- */}
      <View style={hm.top}>
        <TouchableOpacity onPress={onHome} style={[hm.tb,{backgroundColor:'#ffc928',borderColor:'#f0a010'}]}><WIcon n="home"/></TouchableOpacity>
        <TouchableOpacity style={[hm.tb,{backgroundColor:'#8a4fe0',borderColor:'#c9a8f5'}]}><WIcon n="gear"/></TouchableOpacity>
        <TouchableOpacity style={[hm.tb,{backgroundColor:'#e8457a',borderColor:'#f5a0c0'}]}><WIcon n="dots"/></TouchableOpacity>
        <View style={{flex:1}}/>
        <View style={hm.cpill}><Coin s={28}/><Text style={hm.cnum}>{hints}</Text><View style={hm.cplus}><Text style={hm.cplust}>+</Text></View></View>
      </View>
    </Stage>
  </View>}

const hm=StyleSheet.create({
  top:{position:'absolute',top:34,left:0,right:0,flexDirection:'row',alignItems:'center',paddingHorizontal:14,gap:10},
  tb:{width:48,height:48,borderRadius:24,borderWidth:3,alignItems:'center',justifyContent:'center',elevation:5},
  cpill:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#2a1a6e',borderWidth:3,borderColor:'#6a4fe0',borderRadius:26,paddingHorizontal:10,height:48,elevation:5},
  cnum:{fontFamily:F,fontSize:22,fontWeight:'900',color:'#fff',minWidth:16,textAlign:'center'},
  cplus:{width:28,height:28,borderRadius:14,backgroundColor:'#2fc24a',alignItems:'center',justifyContent:'center'},
  cplust:{color:'#fff',fontWeight:'900',fontSize:20,lineHeight:24},
  card:{position:'absolute',backgroundColor:'#e8903a',borderRadius:40,padding:7,elevation:10,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:8,shadowOffset:{width:0,height:5}},
  cardIn:{flex:1,backgroundColor:'#fbf3de',borderRadius:34,borderWidth:3,borderColor:'#f5c07a',overflow:'hidden'},
  content:{flex:1,alignItems:'center',justifyContent:'space-evenly',paddingBottom:12,paddingHorizontal:10},
  q:{fontFamily:F,fontWeight:'900',textAlign:'center'},
  btnOuter:{backgroundColor:'#14632a',borderRadius:42,padding:4,elevation:6,shadowColor:'#000',shadowOpacity:0.3,shadowRadius:5,shadowOffset:{width:0,height:4}},
  btnIn:{backgroundColor:'#34c73c',borderRadius:38,paddingHorizontal:36,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden'},
  btnShine:{position:'absolute',top:4,left:20,right:20,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.35)'},
  btnt:{fontFamily:F,fontWeight:'900',color:'#fff',textShadowColor:'#14632a',textShadowRadius:3,textShadowOffset:{width:1,height:2}},
  lvOuter:{backgroundColor:'#4a1a9a',borderRadius:32,padding:3,elevation:4},
  lvIn:{backgroundColor:'#8a3fe0',borderRadius:29,paddingHorizontal:34,flexDirection:'row',alignItems:'center',gap:10,overflow:'hidden'},
  lvStitch:{position:'absolute',left:4,right:4,top:4,bottom:4,borderRadius:26,borderWidth:1.5,borderStyle:'dashed',borderColor:'rgba(255,255,255,0.6)'},
  lvT:{fontFamily:F,fontWeight:'900',color:'#fff',textShadowColor:'#4a1a9a',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
  err:{color:'#d63a5a',fontFamily:F,fontSize:14,textAlign:'center'},
  signWrap:{position:'absolute',top:-62,left:0,right:0,alignItems:'center'},
  rope:{position:'absolute',top:-14,width:8,height:28,borderRadius:4,backgroundColor:'#c9a070',borderWidth:1.5,borderColor:'#8a6a3a'},
  sign:{backgroundColor:'#a85f26',borderWidth:4,borderColor:'#7a4118',borderRadius:16,paddingHorizontal:28,paddingVertical:6,elevation:6},
  leaf:{position:'absolute',width:20,height:34,borderRadius:17,backgroundColor:'#5fae3a',borderWidth:2,borderColor:'#3f8a2a'},
  lvt:{fontFamily:F,fontSize:36,fontWeight:'900',color:'#fff',textShadowColor:'#5a2f10',textShadowRadius:3,textShadowOffset:{width:1,height:3}}});