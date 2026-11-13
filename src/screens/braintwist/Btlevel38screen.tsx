import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,StyleSheet,ScrollView} from 'react-native';
import * as api from './api';
import * as L from './Btlevel38api';
import {Icon} from './Art';
import {F,INK,Stage} from './BTShared';
import {RiddleCard,Dashes,Keyboard,Mat38} from './Btlevel38art';

const NAVY='#10245e',CREAM='#fbf6e9',SKY='#9fc6ea';
const LEVEL=38,SKIP_COST=50;

export default function BTLevel38Screen({playerId,hints,setHints,onExit,onComplete}:any){
  const [lv,setLv]=useState<L.Level38|null>(null);
  const [typed,setTyped]=useState('');
  const [ov,setOv]=useState<string|null>(null);   // 'check' | 'cross'
  const [note,setNote]=useState('');
  const [done,setDone]=useState(false);
  const busy=useRef(false);
  const shake=useRef(new Animated.Value(0)).current;
  const bal=Number(hints)||0;

  const flash=(m:string,ms=2200)=>{setNote(m);setTimeout(()=>setNote(''),ms)};
  const doShake=()=>Animated.sequence([10,-10,6,-6,0].map(v=>Animated.timing(shake,{toValue:v,duration:55,useNativeDriver:true}))).start();

  useEffect(()=>{L.getLevel().then(setLv).catch(()=>flash('Cannot load level 38',3000))},[]);

  // keyboard: with a 1-letter answer the new letter replaces the old one
  const press=(ch:string)=>{
    if(done||busy.current||!lv)return;
    setTyped(t=>lv.length===1?ch:(t.length<lv.length?t+ch:t));
  };
  const back=()=>{if(!done)setTyped(t=>t.slice(0,-1))};

  // when the dashes are filled -> backend checks the answer and saves the attempt
  useEffect(()=>{
    if(!lv||done||typed.length!==lv.length)return;
    (async()=>{
      if(busy.current)return;
      busy.current=true;
      try{
        const r=await L.submit(playerId,typed);
        if(r.correct){setOv('check');setDone(true);flash(r.message,2500);setTimeout(()=>onComplete({...r,attempts:r.attempts}),1200)}
        else{doShake();setOv('cross');flash(r.message);setTimeout(()=>{setOv(null);setTyped('')},800)}
      }catch(e){flash('Network error');setTyped('')}
      finally{busy.current=false}
    })();
  },[typed]);

  const useHint=async(kind:'search'|'clue')=>{
    if(busy.current||done)return;
    busy.current=true;
    try{
      const c=kind==='search'?await L.getSearchHint(playerId):await L.getClueHint(playerId);
      flash(c.text,4000);
    }catch(e:any){flash(e?.message||'Network error')}
    finally{busy.current=false}};

  const skip=async()=>{
    if(busy.current||done)return;
    if(bal<SKIP_COST){flash('Need '+SKIP_COST+' hints. You have '+bal+'.');return}
    busy.current=true;
    try{const r=await api.skip(LEVEL,playerId);setHints(typeof r?.hints==='number'?r.hints:bal-SKIP_COST);setDone(true);onComplete({...r,skipped:true,attempts:1})}
    catch(e:any){flash(e?.status===402?'Not enough hints':'Network error')}
    finally{busy.current=false}};

  if(!lv)return <Stage bg={SKY}><View style={s.wall}><Text style={s.load}>{note||'Loading level 38...'}</Text></View></Stage>;

  return <Stage bg={SKY}><View style={s.wall}>
    <View style={s.floor}/>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      <View style={s.top}>
        <View style={s.topL}>
          <TouchableOpacity style={s.round} onPress={onExit}><Icon n="home" s={20}/></TouchableOpacity>
          <TouchableOpacity style={s.round}><Icon n="gear" s={20}/></TouchableOpacity>
        </View>
        <View style={s.sign}><Text style={s.signt}>{'‹ LEVEL '+lv.level+' ›'}</Text></View>
        <View style={s.bpill}><Text style={s.bpt}>{hints}</Text><View style={s.bulb}><Icon n="bulb" s={32}/></View></View>
      </View>

      <View style={s.qBox}><Text style={s.q}>{'‹  '+lv.title+'  ›'}</Text></View>

      <Animated.View style={{transform:[{translateX:shake}]}}>
        <RiddleCard lines={lv.lines} title={lv.title}>
          <Dashes text={typed} overlay={!!ov&&<View pointerEvents="none" style={s.cov}><Icon n={ov} s={44}/></View>}/>
        </RiddleCard>
      </Animated.View>

      <View style={{paddingHorizontal:8}}><Keyboard onKey={press} onBack={back} disabled={done}/></View>

      <Text style={s.note}>{note}</Text>

      <View style={{marginBottom:24}}>
        <Mat38 onSearch={()=>useHint('search')} onClue={()=>useHint('clue')} onSkip={skip} disabled={done}/>
      </View>
    </ScrollView>
  </View></Stage>;
}

const s=StyleSheet.create({
  wall:{flex:1,backgroundColor:SKY,overflow:'hidden'},
  content:{flexGrow:1,paddingTop:34},
  floor:{position:'absolute',left:0,right:0,bottom:0,height:'26%',backgroundColor:'#e9b575'},
  load:{fontFamily:F,fontSize:22,color:NAVY,textAlign:'center',marginTop:200},
  top:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10},
  topL:{flexDirection:'row',gap:6,minWidth:84},
  round:{width:34,height:34,borderRadius:17,backgroundColor:'#ffe27a',borderWidth:2,borderColor:INK,alignItems:'center',justifyContent:'center'},
  sign:{backgroundColor:'#a8601f',borderWidth:3,borderColor:'#d98b3d',borderRadius:8,paddingHorizontal:14,paddingVertical:6,elevation:6},
  signt:{fontFamily:F,fontSize:21,fontWeight:'bold',color:'#fff'},
  bpill:{backgroundColor:'#fff',borderRadius:16,height:30,minWidth:70,paddingLeft:12,paddingRight:22,justifyContent:'center',borderWidth:2,borderColor:'#e6e6e6'},
  bpt:{fontFamily:F,fontSize:18,fontWeight:'bold',color:INK},bulb:{position:'absolute',right:-14,top:-8},
  qBox:{alignSelf:'center',backgroundColor:CREAM,borderRadius:30,paddingHorizontal:30,paddingVertical:8,marginTop:14,marginBottom:12,elevation:4},
  q:{fontFamily:F,fontSize:24,fontWeight:'900',color:NAVY,textAlign:'center'},
  cov:{position:'absolute',right:-50,top:2},
  note:{minHeight:26,marginVertical:8,fontFamily:F,fontSize:16,fontWeight:'bold',color:'#c0392b',textAlign:'center',paddingHorizontal:20}});
