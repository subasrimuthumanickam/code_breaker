import React,{useEffect,useRef,useState} from 'react';
import {View,Text,TouchableOpacity,Animated,Easing,StyleSheet,useWindowDimensions} from 'react-native';
import Svg,{Rect,Path,Circle,Polygon,Line,Ellipse} from 'react-native-svg';
import {F,INK,Stage,Smiley,Confetti,loop,useStageW} from './BTShared';
import * as progress from './progressApi';

// same formula as backend (used only if the server can't be reached)
const localStars=(tries:number,hints:number,skipped:boolean)=>skipped?1:Math.max(1,(tries<=1?3:tries===2?2:1)-(hints>0?1:0));

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

const Rays=({w}:any)=><Svg width={w} height={w} viewBox="0 0 200 200">
  {Array.from({length:12},(_,i)=>{const a=(i*30)*Math.PI/180,b=(i*30+14)*Math.PI/180;
    return <Polygon key={i} points={`100,100 ${100+Math.cos(a)*98},${100+Math.sin(a)*98} ${100+Math.cos(b)*98},${100+Math.sin(b)*98}`} fill="#ffe27a" opacity="0.55"/>})}
  <Circle cx="100" cy="100" r="64" fill="#fff6c8" opacity="0.9"/></Svg>;

const Star=({w,on}:any)=><Svg width={w} height={w} viewBox="0 0 100 100">
  <Polygon points="50,6 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36" fill={on?'#ffc72c':'#e3dccb'} stroke={on?INK:'#9a937f'} strokeWidth="5" strokeLinejoin="round"/>
  {on&&<><Polygon points="50,20 58,40 78,42 62,54 67,74 50,62 33,74 38,54 22,42 42,40" fill="#ffe07a"/><Path d="M40 30 L46 24" stroke="#fff" strokeWidth="4" strokeLinecap="round"/></>}</Svg>;

const Ribbon=({w}:any)=><Svg width={w} height={w*0.24} viewBox="0 0 300 72">
  <Polygon points="4,18 54,18 54,58 4,58 20,38" fill="#b7332a" stroke={INK} strokeWidth="3" strokeLinejoin="round"/>
  <Polygon points="296,18 246,18 246,58 296,58 280,38" fill="#b7332a" stroke={INK} strokeWidth="3" strokeLinejoin="round"/>
  <Rect x="34" y="6" width="232" height="50" rx="8" fill="#ef5a4c" stroke={INK} strokeWidth="3"/>
  <Rect x="40" y="11" width="220" height="10" rx="5" fill="#ff8d80"/>
  <Polygon points="34,56 50,56 34,68" fill="#7d1f19" stroke={INK} strokeWidth="2"/>
  <Polygon points="266,56 250,56 266,68" fill="#7d1f19" stroke={INK} strokeWidth="2"/></Svg>;

const CHEERS=[
  {a:'Math is easy...',b:'when you add a little confidence!'},
  {a:'Great job!',b:'Your brain is on fire!'},
  {a:'Smart move...',b:'you are getting sharper!'},
  {a:'Nice one!',b:'Keep that streak going!'},
  {a:'Wow...',b:'that was a tricky one!'}];

export default function BTCongratsScreen({n,hints,playerId,stats,hasNext,onNext,onHome}:any){
  const sw=useStageW(),{height:H}=useWindowDimensions();
  const k=Math.max(0.62,Math.min(1,(H-330)/430));          // shrink on small phones
  const ribW=Math.round(Math.min(sw-48,330)*(0.8+0.2*k)),ribFs=Math.max(12,Math.min(22,Math.floor(ribW*0.64/11.2)));
  const cheer=CHEERS[(n-1)%CHEERS.length],bs=Math.round(20*Math.max(0.85,k));

  // ---- frontend -> backend -> DB ----
  const[res,setRes]=useState<any>(null),[saveErr,setSaveErr]=useState(false),saved=useRef(false);
  useEffect(()=>{if(saved.current)return;saved.current=true;
    progress.complete({playerId,level:n,attempts:stats?.tries??1,hintsUsed:stats?.hints??0,skipped:!!stats?.skipped})
      .then(setRes).catch(()=>setSaveErr(true))},[]);
  const earned=res?.stars??localStars(stats?.tries??1,stats?.hints??0,!!stats?.skipped);

  const rib=useRef(new Animated.Value(0)).current,stars=useRef([0,1,2].map(()=>new Animated.Value(0))).current,
    bub=useRef(new Animated.Value(0)).current,pop=useRef(new Animated.Value(0)).current,btn=useRef(new Animated.Value(0)).current,
    bounce=useRef(new Animated.Value(0)).current,pulse=useRef(new Animated.Value(0)).current,spin=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    Animated.sequence([
      Animated.spring(rib,{toValue:1,friction:5,tension:90,useNativeDriver:true}),
      Animated.stagger(160,stars.map(v=>Animated.spring(v,{toValue:1,friction:3,tension:90,useNativeDriver:true}))),
      Animated.parallel([Animated.spring(bub,{toValue:1,friction:5,tension:70,useNativeDriver:true}),Animated.spring(pop,{toValue:1,friction:4,tension:80,useNativeDriver:true})]),
      Animated.spring(btn,{toValue:1,friction:5,tension:70,useNativeDriver:true})]).start();
    loop(bounce,650);loop(pulse,800);
    Animated.loop(Animated.timing(spin,{toValue:1,duration:12000,easing:Easing.linear,useNativeDriver:true})).start();
  },[]);
  const ribY=rib.interpolate({inputRange:[0,1],outputRange:[-90,0]});
  const starAnim=(v:Animated.Value)=>({opacity:v,transform:[{scale:v},{rotate:v.interpolate({inputRange:[0,1],outputRange:['-60deg','0deg']})}]});
  const bubS=bub.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),popS=pop.interpolate({inputRange:[0,1],outputRange:[0.2,1]}),
    btnS=btn.interpolate({inputRange:[0,1],outputRange:[0.3,1]}),pulseS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.07]}),
    midS=pulse.interpolate({inputRange:[0,1],outputRange:[1,1.12]}),bY=bounce.interpolate({inputRange:[0,1],outputRange:[0,-12]}),
    bR=bounce.interpolate({inputRange:[0,1],outputRange:['-3deg','3deg']}),spinR=spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']});
  const sizes=[Math.round(62*k),Math.round(86*k),Math.round(62*k)];

  return <Stage bg="#c98a4e"><View style={wn.wood}>
    {[0,1,2,3,4,5,6,7,8].map(i=><View key={i} pointerEvents="none" style={[wn.plank,{top:90*i}]}/>)}

    <View style={wn.paper}>
      <View style={wn.holes}>{Array.from({length:11},(_,i)=><View key={i} style={wn.hole}/>)}</View>
      {Array.from({length:24},(_,i)=><View key={i} style={[wn.ln,{top:84+i*34}]}/>)}
      <View style={wn.margin}/>

      <View style={wn.head}>
        <TouchableOpacity onPress={onHome} style={wn.round}><Svg width={20} height={20} viewBox="0 0 24 24"><Path d="M3 12 L12 4 L21 12 V21 H15 V14 H9 V21 H3z" fill={INK}/></Svg></TouchableOpacity>
        <View style={{flex:1}}/>
        <View style={wn.pill}><Text style={wn.pn}>{hints}</Text><Text style={{fontSize:18}}>💡</Text></View>
      </View>

      <View style={wn.body}>
        <Animated.View style={{alignItems:'center',justifyContent:'center',opacity:rib,transform:[{translateY:ribY}]}}>
          <Ribbon w={ribW}/>
          <Text numberOfLines={1} style={[wn.ribt,{fontSize:ribFs,top:ribW*0.24*0.26}]}>{'LEVEL '+n+' COMPLETE!'}</Text>
        </Animated.View>

        <View style={wn.starRow}>
          {[0,1,2].map(i=>{const mid=i===1;
            const core=<Star w={sizes[i]} on={i<earned}/>;
            return <Animated.View key={i} style={[{marginHorizontal:mid?6:0,marginBottom:mid?0:2},starAnim(stars[i])]}>
              {mid?<Animated.View style={{transform:[{scale:midS}]}}>{core}</Animated.View>:core}</Animated.View>})}
        </View>

        <Animated.View style={{alignItems:'center',opacity:bub,transform:[{scale:bubS}]}}>
          <View style={wn.bubble}>
            <Text style={[wn.b1,{fontSize:bs}]}>{cheer.a}</Text>
            <Text style={[wn.b2,{fontSize:bs}]}>{cheer.b}</Text>
            <View style={{position:'absolute',right:14,top:10}}><Smiley w={22}/></View>
          </View>
          <View style={{marginTop:-3,alignSelf:'flex-end',marginRight:70}}>
            <Svg width={28} height={21} viewBox="0 0 34 26"><Polygon points="0,0 34,0 8,26" fill="#fff3a0"/><Path d="M0 0 L8 26 L34 0" stroke={INK} strokeWidth="2.5" fill="none" strokeDasharray="5 3"/></Svg>
          </View>
        </Animated.View>

        <View style={{alignItems:'center',justifyContent:'center',height:Math.round(170*k)}}>
          <Animated.View style={{position:'absolute',opacity:pop,transform:[{rotate:spinR}]}}><Rays w={Math.round(230*k)}/></Animated.View>
          <Animated.View style={{opacity:pop,transform:[{translateY:bY},{rotate:bR},{scale:popS}]}}><BrainHero w={Math.round(170*k)}/></Animated.View>
        </View>
      </View>

      {/* footer: NEXT button always visible */}
      <View style={wn.footer}>
        <Text style={[wn.saved,{color:saveErr?'#c0392b':res?'#2f8a3a':'#8a8a8a'}]}>{saveErr?'Offline - progress not saved':res?'Progress saved ✓':'Saving progress...'}</Text>
        <Animated.View style={{opacity:btn,transform:[{scale:btnS}]}}>
          <Animated.View style={{transform:[{scale:pulseS}]}}>
            <TouchableOpacity activeOpacity={0.85} onPress={onNext} style={wn.btn}>
              <View style={wn.btnShine}/>
              <Text style={wn.btnt}>{hasNext?'NEXT':'DONE'}</Text>
              <Svg width={32} height={32} viewBox="0 0 24 24" style={{marginLeft:8}}>
                <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M3 12 H17 M12 6 L18 12 L12 18" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </View>

    <View pointerEvents="none" style={wn.sticky}><Smiley w={34}/></View>
    <View pointerEvents="none" style={wn.books}>
      {[['Think','#9b4fc0',130],['Learn','#2f7fd0',118],['Grow','#f0a830',124]].map(([t,c,w]:any,i)=>
        <View key={t} style={[wn.book,{backgroundColor:c,width:w,marginLeft:i===1?10:i===2?-4:0}]}><Text style={wn.bookt}>{t+' ♥'}</Text></View>)}
    </View>
    <View pointerEvents="none" style={wn.cup}>
      <View style={[wn.pen,{backgroundColor:'#ee6aa0',left:8,height:34,transform:[{rotate:'-12deg'}]}]}/>
      <View style={[wn.pen,{backgroundColor:'#f6c928',left:22,height:44}]}/>
      <View style={[wn.pen,{backgroundColor:'#2aa7b0',left:36,height:38,transform:[{rotate:'12deg'}]}]}/>
      <View style={wn.cupBody}><Smiley w={26}/></View>
    </View>
    <Confetti/>
  </View></Stage>}

const wn=StyleSheet.create({
  // paddingBottom 110 -> paper ends above the books, so the NEXT button never hides behind them
  wood:{flex:1,backgroundColor:'#c98a4e',paddingTop:30,paddingHorizontal:12,paddingBottom:110,overflow:'hidden'},
  plank:{position:'absolute',left:0,right:0,height:3,backgroundColor:'rgba(90,50,15,0.18)'},
  paper:{flex:1,backgroundColor:'#fffdf8',borderRadius:6,overflow:'hidden',elevation:6,shadowColor:'#000',shadowOpacity:0.25,shadowRadius:6,shadowOffset:{width:0,height:3}},
  holes:{flexDirection:'row',justifyContent:'space-around',marginTop:4},
  hole:{width:16,height:22,borderRadius:8,backgroundColor:'#c98a4e'},
  ln:{position:'absolute',left:0,right:0,height:2,backgroundColor:'#dbe9ee'},
  margin:{position:'absolute',left:30,top:0,bottom:0,width:2,backgroundColor:'rgba(240,120,120,0.35)'},
  head:{flexDirection:'row',alignItems:'center',gap:6,marginTop:10,paddingLeft:12,paddingRight:62},
  round:{width:36,height:36,borderRadius:18,backgroundColor:'#ffd21f',borderWidth:3,borderColor:INK,alignItems:'center',justifyContent:'center'},
  pill:{flexDirection:'row',alignItems:'center',gap:3,borderWidth:2.5,borderColor:INK,borderRadius:18,paddingHorizontal:10,backgroundColor:'#fff',height:34},
  pn:{fontFamily:F,fontSize:18,fontWeight:'900',color:INK},
  body:{flex:1,alignItems:'center',justifyContent:'space-around',paddingVertical:4,paddingHorizontal:10},
  ribt:{position:'absolute',fontFamily:F,fontWeight:'900',color:'#fff',textAlign:'center',textShadowColor:'rgba(0,0,0,0.55)',textShadowRadius:2,textShadowOffset:{width:1,height:2}},
  starRow:{flexDirection:'row',alignItems:'flex-end',justifyContent:'center'},
  bubble:{backgroundColor:'#fff3a0',borderWidth:2.5,borderColor:INK,borderStyle:'dashed',borderRadius:30,paddingHorizontal:22,paddingVertical:10,maxWidth:310},
  b1:{fontFamily:F,fontWeight:'900',color:INK},
  b2:{fontFamily:F,fontWeight:'900',color:'#8e2fa8'},
  footer:{alignItems:'center',paddingBottom:14,paddingTop:4},
  saved:{fontFamily:F,fontSize:13,fontWeight:'bold',marginBottom:6},
  btn:{minWidth:240,height:62,borderRadius:31,backgroundColor:'#7fd83a',borderWidth:4,borderColor:INK,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:30,overflow:'hidden'},
  btnShine:{position:'absolute',top:3,left:18,right:18,height:12,borderRadius:6,backgroundColor:'rgba(255,255,255,0.4)'},
  btnt:{fontFamily:F,fontSize:32,fontWeight:'900',color:INK},
  sticky:{position:'absolute',top:18,right:-4,width:62,height:62,backgroundColor:'#ffe36b',alignItems:'center',justifyContent:'center',transform:[{rotate:'8deg'}],elevation:8,shadowColor:'#000',shadowOpacity:0.2,shadowRadius:3,shadowOffset:{width:0,height:2}},
  books:{position:'absolute',left:4,bottom:6},
  book:{height:30,borderRadius:4,justifyContent:'center',paddingHorizontal:14,marginTop:1,borderBottomWidth:3,borderBottomColor:'rgba(0,0,0,0.25)'},
  bookt:{fontFamily:F,fontSize:14,fontWeight:'900',color:'#fff'},
  cup:{position:'absolute',right:16,bottom:4,width:66,height:90},
  pen:{position:'absolute',top:0,width:10,borderRadius:3,borderTopLeftRadius:5,borderTopRightRadius:5},
  cupBody:{position:'absolute',bottom:0,left:0,right:0,height:52,backgroundColor:'#2f7fd0',borderRadius:6,borderWidth:2.5,borderColor:'#1d5aa0',alignItems:'center',justifyContent:'center'}});