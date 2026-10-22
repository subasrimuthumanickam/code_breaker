
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TextInput,TouchableOpacity,Pressable,Animated,StyleSheet,Easing,ScrollView,useWindowDimensions} from 'react-native';
import {F,INK,Coin} from './BTShared';
import {Icon} from './Art';
import RoomBg from './Btlevel11room';
import * as api from './Btlevel11api';
import * as mainApi from './api';

const SKY='#9fc6ea',NAVY='#10245e',PAPER='#fffdf7';

/* ---------- sheep drawn with plain Views ---------- */
const Sheep=({bob,i}:any)=>{
  const y=bob.interpolate({inputRange:[0,1],outputRange:[0,i%2?-4:4]});
  return <Animated.View style={{margin:3,alignItems:'center',transform:[{translateY:y}]}}>
    <View style={s.wool}><View style={s.face}><View style={s.eyeS}/></View></View>
    <View style={{flexDirection:'row',gap:14,marginTop:-2}}><View style={s.leg}/><View style={s.leg}/></View>
  </Animated.View>};

/* ---------- alarm clock scene (plain Views) ---------- */
const ClockArt=({bob}:any)=>{
  const wig=bob.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']});
  return <View style={s.scene}>
    <View style={s.cloudA}/><View style={s.cloudB}/>
    <View style={s.deskArt}/>
    {/* shine rays */}
    <View style={[s.rayA,{left:'18%',top:70,transform:[{rotate:'-10deg'}]}]}/>
    <View style={[s.rayA,{left:'22%',top:112,transform:[{rotate:'30deg'}]}]}/>
    <View style={[s.rayA,{right:'30%',top:62,transform:[{rotate:'-40deg'}]}]}/>
    <View style={[s.rayA,{right:'28%',top:104,transform:[{rotate:'-5deg'}]}]}/>
    <Animated.View style={[s.clockWrap,{transform:[{rotate:wig}]}]}>
      <View style={[s.bell,{left:8,transform:[{rotate:'-28deg'}]}]}/><View style={[s.bell,{right:8,transform:[{rotate:'28deg'}]}]}/>
      <View style={s.handle}/>
      <View style={s.clockBody}>
        <View style={s.faceIn}>
          <Text style={[s.cn,{top:1,left:0,right:0,textAlign:'center'}]}>12</Text>
          <Text style={[s.cn,{bottom:1,left:0,right:0,textAlign:'center'}]}>6</Text>
          <Text style={[s.cn,{right:5,top:44}]}>3</Text>
          <Text style={[s.cn,{left:5,top:44}]}>9</Text>
          {/* hour + minute hands */}
          <View style={[s.handBox,{transform:[{rotate:'-70deg'}]}]}><View style={[s.hand,{top:56-26,height:26,backgroundColor:INK}]}/></View>
          <View style={[s.handBox,{transform:[{rotate:'62deg'}]}]}><View style={[s.hand,{top:56-38,height:38,backgroundColor:'#e5384b'}]}/></View>
          <View style={s.pin}/>
          {/* happy face */}
          <View style={[s.eye,{left:30}]}/><View style={[s.eye,{right:30}]}/>
          <View style={s.mouth}/>
        </View>
      </View>
      <View style={[s.legC,{left:26,transform:[{rotate:'14deg'}]}]}/><View style={[s.legC,{right:26,transform:[{rotate:'-14deg'}]}]}/>
    </Animated.View>
    {/* plant on books */}
    <View style={s.books}>
      <View style={[s.bookC,{backgroundColor:'#e86fae',width:92}]}/><View style={[s.bookC,{backgroundColor:'#6a7fd0',width:84,marginLeft:6}]}/>
      <View style={s.plantBox}>
        <View style={[s.leafC,{left:2,transform:[{rotate:'-30deg'}]}]}/><View style={[s.leafC,{left:16,height:34,backgroundColor:'#3f9a2e'}]}/><View style={[s.leafC,{left:30,transform:[{rotate:'30deg'}]}]}/>
        <View style={s.pot}/>
      </View>
    </View>
  </View>};

function PopBtn({inner,onPress,children}:any){
  const sc=useRef(new Animated.Value(1)).current;
  const to=(v:number)=>Animated.spring(sc,{toValue:v,friction:5,tension:220,useNativeDriver:true}).start();
  return <Pressable onPress={onPress} onPressIn={()=>to(0.88)} onPressOut={()=>to(1)}>
    <Animated.View style={[inner,{transform:[{scale:sc}]}]}>{children}</Animated.View></Pressable>}

/* small round button with the "x50" bulb badge on top */
const ActBtn=({color,onPress,icon,cost,coin}:any)=>
  <View style={s.acol}>
    <View style={s.badge}>{coin?<Coin s={14}/>:<Icon n="bulb" s={20}/>}<Text style={s.badgeT}>{cost}</Text></View>
    <PopBtn inner={[s.actBtn,{backgroundColor:color}]} onPress={onPress}>{icon}</PopBtn>
  </View>;

export default function BTLevel11Screen({playerId,hints,setHints,onExit,onComplete}:any){
  const{width}=useWindowDimensions();
  const wide=width>=700;
  const[lv,setLv]=useState<any>(null),[typed,setTyped]=useState(''),[ov,setOv]=useState<string|null>(null),
    [note,setNote]=useState(''),[hintTxt,setHintTxt]=useState<string[]>([]),[done,setDone]=useState(false),[busy,setBusy]=useState(false);
  const shake=useRef(new Animated.Value(0)).current,
    bob=useRef(new Animated.Value(0)).current,qIn=useRef(new Animated.Value(0)).current;
  const flash=(m:string)=>{setNote(m);setTimeout(()=>setNote(''),1800)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();
  const yoyo=(v:Animated.Value,ms:number)=>Animated.loop(Animated.sequence([
    Animated.timing(v,{toValue:1,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
    Animated.timing(v,{toValue:0,duration:ms,easing:Easing.inOut(Easing.sin),useNativeDriver:true})])).start();

  /* frontend -> backend: start the level */
  useEffect(()=>{
    api.start(playerId).then((r:any)=>{
      setLv(r.level);
      if(r.session?.shownHints?.length)setHintTxt(r.session.shownHints);
      if(typeof r.hints==='number')setHints&&setHints(r.hints);
      Animated.spring(qIn,{toValue:1,friction:6,tension:70,useNativeDriver:true}).start();
    }).catch(()=>flash('Cannot load level 11'));
    yoyo(bob,700);
  },[]);

  const qRot=qIn.interpolate({inputRange:[0,1],outputRange:['-8deg','-1.5deg']});

  /* frontend -> backend: submit answer */
  const submit=async()=>{
    if(done||busy||!typed)return;setBusy(true);
    try{
      const r:any=await api.answer(playerId,typed);
      if(r.correct){setOv('check');setDone(true);setTimeout(()=>onComplete&&onComplete({...r,skipped:false}),1100)}
      else{doShake();setOv('cross');flash(r.message||'Not quite. Try again!');setTimeout(()=>{setOv(null);setTyped('')},800)}
    }catch(e:any){flash('Network error')}
    setBusy(false)};

  const hint=async()=>{
    try{const r:any=await api.hint(playerId);
      setHintTxt(h=>[...h,r.hint.text]);
      if(typeof r.hints==='number')setHints&&setHints(r.hints);
    }catch(e:any){flash(e.status===402?'Not enough hints':e.status===400?'No more hints':'Network error')}};
  const skip=async()=>{
    try{const r:any=await api.skip(playerId);
      if(typeof r.hints==='number')setHints&&setHints(r.hints);
      setDone(true);onComplete&&onComplete({...r,skipped:true});
    }catch(e:any){flash(e.status===402?'Not enough hints':'Network error')}};
  const video=async()=>{try{const r:any=await mainApi.reward(playerId,'video');setHints&&setHints(r.hints)}catch(e){}};

  const Top=()=><View style={s.top}>
    <View style={s.topL}>
      <TouchableOpacity style={s.round} onPress={onExit}><Icon n="gear" s={22}/></TouchableOpacity>
      <TouchableOpacity style={s.round} onPress={onExit}><Text style={s.dots}>•••</Text></TouchableOpacity>
    </View>
    <View style={s.titleWrap}>
      <View style={[s.ray,{transform:[{rotate:'-25deg'}]}]}/><Text style={s.title}>Level 11</Text><View style={[s.ray,{transform:[{rotate:'25deg'}]}]}/>
    </View>
    <View style={s.topR}><View style={s.bpill}><Text style={s.bpt}>{hints}</Text></View>
      <View style={s.bulbTop}><Icon n="bulb" s={44}/></View></View>
  </View>;

  if(!lv)return <View style={s.root}><RoomBg/>
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text style={s.load}>{note||'Loading level 11...'}</Text></View></View>;

  /* ---- notebook paper with the question ---- */
  const Paper=<Animated.View style={[s.paperWrap,wide&&{width:'42%'},{opacity:qIn,transform:[{rotate:qRot}]}]}>
    <View style={s.paperBack}/>
    <View style={s.paper}>
      <View style={s.holes}>{Array.from({length:10},(_,i)=><View key={i} style={s.hole}/>)}</View>
      {[0,1,2,3,4,5,6,7].map(i=><View key={i} style={[s.rule,{top:70+i*34}]}/>)}
      <Text style={s.q}>{lv.question}</Text>
      <View style={s.hl}><Text style={s.hlT}>Type your answer{'\n'}in words.</Text></View>
      {hintTxt.length>0&&<View style={{marginTop:12,gap:4}}>{hintTxt.map((h,i)=><Text key={i} style={s.hintT}>{'💡 '+h}</Text>)}</View>}
    </View>
  </Animated.View>;

  /* ---- picture card + input ---- */
  const Right=<View style={[s.right,wide&&{width:'52%'}]}>
    <Animated.View style={[s.card,{transform:[{translateX:shake}]}]}>
      <ClockArt bob={bob}/>
    </Animated.View>
    <View style={s.inputPill}>
      <TextInput style={s.input} value={typed} placeholder="Type here..." placeholderTextColor="#b7b0a2"
        autoCapitalize="none" autoCorrect={false} maxLength={lv.maxDigits||30} editable={!done}
        onChangeText={t=>setTyped(t.replace(/[^a-zA-Z ]/g,''))} onSubmitEditing={submit} returnKeyType="done"/>
      <TouchableOpacity style={[s.go,{opacity:typed?1:0.4}]} disabled={!typed||done||busy} onPress={submit}><Text style={s.goT}>✓</Text></TouchableOpacity>
      {!!ov&&<View pointerEvents="none" style={s.cov}><Icon n={ov} s={44}/></View>}
    </View>
    {!!note&&<Text style={s.note}>{note}</Text>}
  </View>;

  return <View style={s.root}>
    <RoomBg/>
    <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Top/>
      <View style={[s.main,wide&&{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
        {Paper}{Right}
      </View>
      {/* hint / video / (skip) buttons */}
      <View style={s.actions}>
        <ActBtn color="#f5a043" onPress={hint} cost={'x'+lv.hintCost} icon={<Icon n="search" s={32}/>}/>
        <ActBtn color="#7ed321" onPress={video} cost={'+75'} coin icon={<Icon n="film" s={36}/>}/>
        <ActBtn color="#f0545a" onPress={skip} cost={'x'+lv.skipCost} icon={<Icon n="play" s={32}/>}/>
      </View>
    </ScrollView>
    {wide&&<><Text style={s.star}>★</Text><View style={s.bulbBR}><Icon n="bulb" s={60}/></View></>}
  </View>;
}

const s=StyleSheet.create({
  root:{flex:1,backgroundColor:SKY,overflow:'hidden'},
  scroll:{flexGrow:1,paddingTop:12,paddingBottom:20,paddingHorizontal:10},
  load:{fontFamily:F,fontSize:22,color:NAVY},
  /* top bar */
  top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  topL:{flexDirection:'row',gap:6},
  round:{width:38,height:38,borderRadius:19,backgroundColor:'#ffd93b',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
  dots:{fontSize:14,fontWeight:'bold',color:INK,letterSpacing:1},
  titleWrap:{flexDirection:'row',alignItems:'center',gap:6},
  title:{fontFamily:F,fontSize:30,fontWeight:'bold',color:INK},
  ray:{width:16,height:5,borderRadius:3,backgroundColor:'#ffd93b'},
  topR:{alignItems:'flex-end',justifyContent:'center',marginRight:6},
  bpill:{backgroundColor:'#fff',borderRadius:19,height:36,minWidth:64,paddingLeft:12,paddingRight:28,justifyContent:'center',borderWidth:3,borderColor:INK},
  bpt:{fontFamily:F,fontSize:19,fontWeight:'bold',color:INK},
  bulbTop:{position:'absolute',right:-8,top:-8},
  /* layout */
  main:{marginTop:30,gap:18},
  right:{width:'100%',gap:14},
  /* notebook paper */
  paperWrap:{width:'100%',minHeight:230},
  paperBack:{position:'absolute',left:6,right:-4,top:10,bottom:-8,backgroundColor:'#ebe6d8',borderRadius:4,transform:[{rotate:'1.5deg'}]},
  paper:{backgroundColor:PAPER,borderRadius:4,minHeight:230,paddingHorizontal:22,paddingTop:46,paddingBottom:20,overflow:'hidden',elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:6,shadowOffset:{width:0,height:3}},
  holes:{position:'absolute',left:0,right:0,top:8,flexDirection:'row',justifyContent:'space-around',paddingHorizontal:10},
  hole:{width:18,height:18,borderRadius:9,backgroundColor:'#e9c796'},
  rule:{position:'absolute',left:0,right:0,height:1.5,backgroundColor:'#cfe0f2'},
  q:{fontFamily:F,fontSize:21,fontWeight:'bold',color:NAVY,textAlign:'center',lineHeight:36,marginTop:4},
  hl:{alignSelf:'center',marginTop:14,backgroundColor:'#ffe94d',paddingHorizontal:22,paddingVertical:8,borderRadius:10,transform:[{rotate:'-2deg'}]},
  hlT:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK,textAlign:'center'},
  hintT:{fontFamily:F,fontSize:16,color:NAVY},
  /* picture card */
  card:{height:230,borderRadius:18,borderWidth:4,borderColor:INK,backgroundColor:'#3fc1f5',overflow:'hidden',justifyContent:'flex-end'},
  desk:{backgroundColor:'#f2a04a',borderTopWidth:4,borderColor:INK,paddingHorizontal:8,paddingTop:8,paddingBottom:8},
  cloud1:{position:'absolute',left:'8%',top:18,width:90,height:28,borderRadius:14,backgroundColor:'rgba(255,255,255,0.9)'},
  cloud2:{position:'absolute',right:'8%',top:36,width:70,height:22,borderRadius:11,backgroundColor:'rgba(255,255,255,0.8)'},
  grass:{backgroundColor:'#7cc94a',borderWidth:3,borderColor:INK,borderRadius:16,paddingVertical:8,paddingHorizontal:6,justifyContent:'center'},
  sheepWrap:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center'},
  wool:{width:38,height:28,borderRadius:14,backgroundColor:'#fff',borderWidth:2,borderColor:'#dcdcdc'},
  face:{position:'absolute',right:-6,top:6,width:16,height:16,borderRadius:8,backgroundColor:'#3b3b3d',alignItems:'center'},
  eyeS:{marginTop:5,width:3,height:3,borderRadius:2,backgroundColor:'#fff'},
  leg:{width:4,height:8,borderRadius:2,backgroundColor:'#3b3b3d'},
  /* input */
  inputPill:{height:58,borderRadius:29,borderWidth:3,borderColor:INK,backgroundColor:'#fffaf0',flexDirection:'row',alignItems:'center',paddingHorizontal:22},
  input:{flex:1,fontFamily:F,fontSize:28,fontWeight:'bold',color:INK,paddingVertical:0},
  go:{width:42,height:42,borderRadius:21,backgroundColor:'#b6ef63',borderWidth:2.5,borderColor:INK,alignItems:'center',justifyContent:'center'},
  goT:{fontSize:22,fontWeight:'bold',color:INK},
  cov:{position:'absolute',left:0,right:0,top:0,bottom:0,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,250,240,0.6)',borderRadius:33},
  note:{fontFamily:F,fontSize:18,fontWeight:'bold',color:'#c0392b',textAlign:'center'},
  /* bottom buttons */
  actions:{flexDirection:'row',justifyContent:'center',alignItems:'flex-end',gap:26,marginTop:18},
  acol:{alignItems:'center'},
  badge:{flexDirection:'row',alignItems:'center',gap:3,marginBottom:-6,zIndex:2,alignSelf:'flex-start',marginLeft:-8},
  badgeT:{fontFamily:F,fontSize:17,fontWeight:'bold',color:INK},
  actBtn:{width:62,height:62,borderRadius:31,borderWidth:4,borderColor:INK,alignItems:'center',justifyContent:'center',elevation:6},
  /* decor (wide screens only) */
  star:{position:'absolute',left:26,bottom:22,fontSize:56,color:'#ffd93b',textShadowColor:INK,textShadowRadius:2,textShadowOffset:{width:1,height:1}},
  bulbBR:{position:'absolute',right:26,bottom:22},
  /* clock scene */
  scene:{position:'absolute',left:0,right:0,top:0,bottom:0},
  cloudA:{position:'absolute',left:'6%',top:22,width:80,height:24,borderRadius:12,backgroundColor:'rgba(255,255,255,0.9)'},
  cloudB:{position:'absolute',right:'8%',top:14,width:64,height:20,borderRadius:10,backgroundColor:'rgba(255,255,255,0.85)'},
  deskArt:{position:'absolute',left:0,right:0,bottom:0,height:48,backgroundColor:'#f2a04a',borderTopWidth:3,borderColor:INK},
  rayA:{position:'absolute',width:22,height:6,borderRadius:3,backgroundColor:'#ffd93b'},
  clockWrap:{position:'absolute',left:'50%',marginLeft:-82,bottom:14,width:164,height:176},
  bell:{position:'absolute',top:0,width:44,height:26,borderTopLeftRadius:26,borderTopRightRadius:26,backgroundColor:'#f5b82e',borderWidth:3,borderColor:INK},
  handle:{position:'absolute',top:4,left:42,width:80,height:22,borderTopLeftRadius:18,borderTopRightRadius:18,borderWidth:5,borderBottomWidth:0,borderColor:'#4b4b5a'},
  clockBody:{position:'absolute',top:16,left:14,width:136,height:136,borderRadius:68,backgroundColor:'#e5384b',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
  faceIn:{width:112,height:112,borderRadius:56,backgroundColor:'#fff8e8',borderWidth:2,borderColor:INK,overflow:'hidden'},
  cn:{position:'absolute',fontFamily:F,fontSize:12,fontWeight:'bold',color:INK},
  handBox:{position:'absolute',left:0,top:0,width:112,height:112},
  hand:{position:'absolute',left:54,width:4,borderRadius:2},
  pin:{position:'absolute',left:51,top:51,width:10,height:10,borderRadius:5,backgroundColor:'#e5384b',borderWidth:2,borderColor:INK},
  eye:{position:'absolute',top:62,width:14,height:8,borderTopLeftRadius:8,borderTopRightRadius:8,borderTopWidth:3,borderColor:INK},
  mouth:{position:'absolute',top:78,left:41,width:30,height:15,borderBottomLeftRadius:15,borderBottomRightRadius:15,backgroundColor:'#e5304a',borderWidth:2,borderColor:INK},
  legC:{position:'absolute',bottom:0,width:10,height:22,borderRadius:4,backgroundColor:'#4b4b5a'},
  books:{position:'absolute',right:-6,bottom:48,width:104},
  bookC:{height:20,borderRadius:3,borderWidth:2,borderColor:INK,marginTop:1},
  plantBox:{position:'absolute',left:24,bottom:38,width:56,height:70},
  leafC:{position:'absolute',bottom:24,width:18,height:42,borderRadius:10,backgroundColor:'#4fae3a',borderWidth:2,borderColor:INK},
  pot:{position:'absolute',left:8,bottom:0,width:40,height:26,borderRadius:5,backgroundColor:'#e8802a',borderWidth:2,borderColor:INK},
});
