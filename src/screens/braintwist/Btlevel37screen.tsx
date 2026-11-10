
import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,StyleSheet,ScrollView} from 'react-native';
import * as api from './api';
import * as L from './Btlevel37api';
import {Icon} from './Art';
import {F,INK,Stage} from './BTShared';
import {Brothers,Mat} from './Btlevel37art';

const NAVY='#10245e',CREAM='#fbf6e9',SKY='#9fc6ea';
const LEVEL=37,HINT_COST=25,SKIP_COST=50;

export default function BTLevel37Screen({playerId,hints,setHints,onExit,onComplete}:any){
  const [lv,setLv]=useState<L.Level37|null>(null);
  const [count,setCount]=useState(0);
  const [ov,setOv]=useState<string|null>(null);
  const [note,setNote]=useState('');
  const [done,setDone]=useState(false);
  const busy=useRef(false);
  const shake=useRef(new Animated.Value(0)).current;
  const bal=Number(hints)||0;

  const flash=(m:string,ms=1800)=>{setNote(m);setTimeout(()=>setNote(''),ms)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  useEffect(()=>{L.getLevel().then(setLv).catch(()=>flash('Cannot load level 37',3000))},[]);

  // SUBMIT -> backend checks the answer (6) and saves the attempt in the database
  const submit=async()=>{
    if(busy.current||done)return;
    busy.current=true;
    try{
      const r=await L.submit(playerId,count);
      if(r.correct){setOv('check');setDone(true);flash(r.message,2500);setTimeout(()=>onComplete({...r,attempts:r.attempts}),1200)}
      else{doShake();setOv('cross');flash(r.message);setTimeout(()=>setOv(null),800)}
    }catch(e){flash('Network error')}
    finally{busy.current=false}};

  const clue=async()=>{
    if(busy.current||done)return;
    if(bal<HINT_COST){flash('Need '+HINT_COST+' hints. You have '+bal+'.');return}
    busy.current=true;
    try{const h=await api.hint(LEVEL,playerId,[]);setHints(h.hints);const c=await L.getClue();flash(c.clue,3500)}
    catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}
    finally{busy.current=false}};

  const video=async()=>{
    if(busy.current)return;
    busy.current=true;
    try{const r=await api.reward(playerId,'video');setHints(r.hints)}catch(e){}
    finally{busy.current=false}};

  const skip=async()=>{
    if(busy.current||done)return;
    if(bal<SKIP_COST){flash('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
    busy.current=true;
    try{const r=await api.skip(LEVEL,playerId);setHints(typeof r?.hints==='number'?r.hints:bal-SKIP_COST);setDone(true);onComplete({...r,skipped:true,attempts:1})}
    catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}
    finally{busy.current=false}};

  if(!lv)return <Stage bg={SKY}><View style={s.wall}><Text style={s.load}>{note||'Loading level 37...'}</Text></View></Stage>;

  return <Stage bg={SKY}><View style={s.wall}>
    <View style={s.floor}/>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      <View style={s.top}>
        <View style={s.topL}>
          <TouchableOpacity style={s.round} onPress={onExit}><Icon n="home" s={20}/></TouchableOpacity>
          <TouchableOpacity style={s.round}><Icon n="gear" s={20}/></TouchableOpacity>
        </View>
        <View style={s.sign}><Text style={s.signt}>{'LEVEL '+lv.level}</Text></View>
        <View style={s.bpill}><Text style={s.bpt}>{hints}</Text><View style={s.bulb}><Icon n="bulb" s={32}/></View></View>
      </View>

      <View style={s.qBox}><Text style={s.q}>{lv.question}</Text></View>

      <Animated.View style={{alignItems:'center',marginTop:10,transform:[{translateX:shake}]}}>
        <Brothers w={270}/>
      </Animated.View>

      <View style={s.crow}>
        <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.max(lv.min,c-1))}><Text style={s.cbt}>−</Text></TouchableOpacity>
        <View style={s.cnumBox}><Text style={s.cnum}>{count}</Text>{!!ov&&<View pointerEvents="none" style={s.cov}><Icon n={ov} s={56}/></View>}</View>
        <TouchableOpacity style={s.cbtn} disabled={done} onPress={()=>setCount(c=>Math.min(lv.max,c+1))}><Text style={s.cbt}>+</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={s.submit} disabled={done} onPress={submit}><Text style={s.subt}>SUBMIT</Text></TouchableOpacity>

      <Text style={s.note}>{note}</Text>

      <View style={{marginBottom:24}}>
        <Mat onClue={clue} onVideo={video} onSkip={skip} disabled={done} hintCost={HINT_COST} skipCost={SKIP_COST}/>
      </View>
    </ScrollView>
  </View></Stage>;
}

const s=StyleSheet.create({
  wall:{flex:1,backgroundColor:SKY,overflow:'hidden'},
  content:{flexGrow:1,paddingTop:34},
  floor:{position:'absolute',left:0,right:0,bottom:0,height:'28%',backgroundColor:'#e9b575'},
  load:{fontFamily:F,fontSize:22,color:NAVY,textAlign:'center',marginTop:200},
  top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10},
  topL:{flexDirection:'row',gap:6,minWidth:84},
  round:{width:34,height:34,borderRadius:17,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  sign:{backgroundColor:'#a8601f',borderWidth:3,borderColor:'#d98b3d',borderRadius:8,paddingHorizontal:18,paddingVertical:6,elevation:6},
  signt:{fontFamily:F,fontSize:22,fontWeight:'bold',color:'#fff'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:70,paddingLeft:12,paddingRight:22,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},bulb:{position:'absolute',right:-14,top:-8},
  qBox:{backgroundColor:CREAM,borderRadius:30,paddingHorizontal:20,paddingVertical:12,marginHorizontal:14,marginTop:16,elevation:4},
  q:{fontFamily:F,fontSize:22,fontWeight:'bold',color:NAVY,textAlign:'center'},
  crow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',alignSelf:'center',width:'74%',backgroundColor:CREAM,borderRadius:40,padding:6,marginTop:10,elevation:3},
  cbtn:{width:54,height:54,borderRadius:27,backgroundColor:'#1e9bf0',borderWidth:3,borderColor:'#0d6fb8',alignItems:'center',justifyContent:'center'},
  cbt:{fontFamily:F,fontSize:34,fontWeight:'bold',color:'#fff',lineHeight:40},
  cnumBox:{minWidth:80,alignItems:'center',justifyContent:'center'},cnum:{fontFamily:F,fontSize:48,fontWeight:'900',color:NAVY},
  cov:{position:'absolute',left:0,right:0,top:-6,alignItems:'center'},
  submit:{alignSelf:'center',marginTop:12,backgroundColor:'#a6e22e',borderRadius:40,paddingHorizontal:60,paddingVertical:10,borderWidth:4,borderColor:'#6fb51b',elevation:5},
  subt:{fontFamily:F,fontSize:30,fontWeight:'900',color:NAVY},
  note:{minHeight:26,marginVertical:6,fontFamily:F,fontSize:16,fontWeight:'bold',color:'#c0392b',textAlign:'center',paddingHorizontal:20}});