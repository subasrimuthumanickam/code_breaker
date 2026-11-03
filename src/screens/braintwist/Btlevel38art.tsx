// Level 38 art: notebook riddle card, QWERTY keyboard, bottom mat (Search / Clue / Skip)
import React from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
import Svg,{Polygon} from 'react-native-svg';
import {Icon} from './Art';
import {F} from './BTShared';

const NAVY='#10245e',CREAM='#fbf6e9';

/* ---------- notebook card with the riddle ---------- */
export const RiddleCard=({lines,title,children}:any)=><View style={s.paper}>
  <View style={s.holes}>{Array.from({length:8},(_,i)=><View key={i} style={s.hole}/>)}</View>
  {lines.map((l:string,i:number)=><Text key={i} style={s.rt}>{l}</Text>)}
  <View style={s.hl}><Text style={s.hlt}>{title}</Text></View>
  {children}
</View>;

/* ---------- the dashes row (letters typed show above it) ---------- */
export const Dashes=({text,overlay}:any)=><View style={s.dwrap}>
  <View style={s.typedBox}><Text style={s.typed}>{text}</Text>{overlay}</View>
  <View style={s.dashRow}>{Array.from({length:10},(_,i)=><View key={i} style={s.dash}/>)}</View>
</View>;

/* ---------- keyboard ---------- */
const ROWS=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M']];
const PAD=['0%','5%','9%'];
export const Keyboard=({onKey,onBack,disabled}:any)=><View style={s.kb}>
  {ROWS.map((row,ri)=><View key={ri} style={[s.krow,{paddingHorizontal:PAD[ri]}]}>
    {row.map(ch=><Pressable key={ch} disabled={disabled} onPress={()=>onKey(ch)} style={({pressed})=>[s.key,{transform:[{scale:pressed?0.9:1}]}]}>
      <Text style={s.kt}>{ch}</Text></Pressable>)}
    {ri===2&&<Pressable disabled={disabled} onPress={onBack} style={({pressed})=>[s.key,s.back,{transform:[{scale:pressed?0.9:1}]}]}>
      <Text style={[s.kt,{fontSize:22}]}>⌫</Text></Pressable>}
  </View>)}
</View>;

/* ---------- bottom mat: Search / Clue / Skip ---------- */
const FastForward=({s:sz=34}:any)=><Svg width={sz} height={sz} viewBox="0 0 40 40">
  <Polygon points="4,6 20,20 4,34" fill="#222"/><Polygon points="20,6 36,20 20,34" fill="#222"/></Svg>;

const Pop=({inner,onPress,disabled,children}:any)=><Pressable disabled={disabled} onPress={onPress} style={({pressed})=>[{transform:[{scale:pressed?0.9:1}]}]}>
  <View style={inner}>{children}</View></Pressable>;

export const Mat38=({onSearch,onClue,onSkip,disabled}:any)=><View style={s.mat}>
  <View style={s.col}><Pop inner={s.search} onPress={onSearch} disabled={disabled}><Icon n="search" s={34}/></Pop>
    <View style={s.pill}><Text style={s.pt}>Search</Text></View></View>
  <View style={s.col}><Pop inner={s.clue} onPress={onClue} disabled={disabled}><Icon n="bulb" s={34}/></Pop>
    <View style={s.pill}><Text style={s.pt}>Clue</Text></View></View>
  <View style={s.col}><Pop inner={s.skip} onPress={onSkip} disabled={disabled}><FastForward/></Pop>
    <View style={s.pill}><Text style={s.pt}>Skip</Text></View></View>
</View>;

const s=StyleSheet.create({
  paper:{backgroundColor:'#fffdf8',borderRadius:10,marginHorizontal:14,paddingTop:6,paddingBottom:12,paddingHorizontal:12,alignItems:'center',elevation:5,borderWidth:1,borderColor:'#e3eaf0'},
  holes:{flexDirection:'row',justifyContent:'space-around',alignSelf:'stretch',marginBottom:6},
  hole:{width:14,height:14,borderRadius:7,backgroundColor:'#bcdcf0'},
  rt:{fontFamily:F,fontSize:23,fontWeight:'900',color:NAVY,textAlign:'center',lineHeight:30},
  hl:{backgroundColor:'#bcd8f8',borderRadius:14,paddingHorizontal:26,paddingVertical:4,marginTop:8},
  hlt:{fontFamily:F,fontSize:26,fontWeight:'900',color:NAVY},
  dwrap:{alignSelf:'stretch',alignItems:'center',marginTop:6},
  typedBox:{height:52,minWidth:80,alignItems:'center',justifyContent:'center'},
  typed:{fontFamily:F,fontSize:44,fontWeight:'900',color:NAVY,letterSpacing:4},
  dashRow:{flexDirection:'row',justifyContent:'space-between',alignSelf:'stretch'},
  dash:{width:'8%',height:5,borderRadius:2,backgroundColor:NAVY},
  kb:{marginTop:12,gap:7},
  krow:{flexDirection:'row',justifyContent:'center',gap:4,paddingHorizontal:0},
  key:{flex:1,aspectRatio:0.82,maxWidth:46,backgroundColor:CREAM,borderRadius:9,borderWidth:2,borderColor:'#e3d6b8',alignItems:'center',justifyContent:'center',elevation:3},
  back:{backgroundColor:'#f9d3d9',borderColor:'#eab0ba'},
  kt:{fontFamily:F,fontSize:20,fontWeight:'900',color:NAVY},
  mat:{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-start',alignSelf:'center',width:'90%',backgroundColor:'#f7e7cb',borderWidth:6,borderColor:'#a9cbe6',borderRadius:44,paddingVertical:14,elevation:6},
  col:{alignItems:'center'},
  search:{width:62,height:62,borderRadius:31,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
  clue:{width:62,height:62,borderRadius:31,backgroundColor:'#b46ef0',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  skip:{width:62,height:62,borderRadius:31,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  pill:{height:26,marginTop:8,paddingHorizontal:16,borderRadius:13,backgroundColor:'#6b4423',justifyContent:'center'},
  pt:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'}});
