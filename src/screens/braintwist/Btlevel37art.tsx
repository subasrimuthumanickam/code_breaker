
import React from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
import Svg,{Circle,Rect,Path,Ellipse} from 'react-native-svg';
import {Icon} from './Art';
import {F,Coin} from './BTShared';

const SHIRT=['#cfcfcf','#6fd34a','#8e4fd6','#f28a1e','#6fd34a'];
const HAIR=['#a0522d','#f5c542','#8b5a2b','#e8a04c','#8b4a2b'];
const SHORT=['#5fc83a','#4b7fc4','#5fc83a','#5fc83a','#e85a4f'];

export const Brothers=({w=320}:any)=><Svg width={w} height={w*0.47} viewBox="0 0 320 150">
  <Ellipse cx="160" cy="144" rx="150" ry="8" fill="rgba(255,255,255,0.35)"/>
  {SHIRT.map((c,i)=>{const x=36+62*i;return <React.Fragment key={i}>
    <Path d={`M${x-36} 98 L${x+36} 98`} stroke="#f6c9a0" strokeWidth="7" strokeLinecap="round"/>
    <Rect x={x-20} y="112" width="40" height="22" rx="6" fill={SHORT[i]}/>
    <Ellipse cx={x-10} cy="138" rx="11" ry="6" fill="#e8523f"/><Ellipse cx={x+10} cy="138" rx="11" ry="6" fill="#f5c542"/>
    <Rect x={x-22} y="76" width="44" height="42" rx="10" fill={c}/>
    <Circle cx={x} cy="50" r="24" fill="#fcd7b0"/>
    <Path d={`M${x-25} 48 Q${x} 10 ${x+25} 48 Q${x} 34 ${x-25} 48Z`} fill={HAIR[i]}/>
    <Circle cx={x-8} cy="52" r="2.4" fill="#3b2a20"/><Circle cx={x+8} cy="52" r="2.4" fill="#3b2a20"/>
    <Path d={`M${x-9} 60 Q${x} 70 ${x+9} 60`} stroke="#3b2a20" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
  </React.Fragment>})}
</Svg>;

const Pop=({style,inner,onPress,disabled,children}:any)=><Pressable disabled={disabled} onPress={onPress} style={({pressed})=>[style,{transform:[{scale:pressed?0.9:1}]}]}>
  <View style={inner}>{children}</View></Pressable>;

export const Mat=({onClue,onVideo,onSkip,disabled,hintCost=25,videoReward=75,skipCost=50}:any)=><View style={s.mat}>
  <View style={s.col}>
    <Pop inner={s.clue} onPress={onClue} disabled={disabled}><Icon n="search" s={34}/></Pop>
    <View style={s.pill}><Text style={s.pt}>Hint</Text></View>
  </View>
  <View style={s.col}>
    <Pop inner={s.video} onPress={onVideo} disabled={disabled}><Icon n="film" s={36}/></Pop>
    <View style={s.pill}><Coin s={12}/><Text style={s.pt}>+{videoReward}</Text></View>
  </View>
  <View style={s.col}>
    <Pop inner={s.skip} onPress={onSkip} disabled={disabled}><Icon n="play" s={34}/></Pop>
    <View style={s.pill}><Icon n="bulb" s={14}/><Text style={s.pt}>{skipCost}</Text></View>
  </View>
</View>;

const s=StyleSheet.create({
  mat:{flexDirection:'row',justifyContent:'space-around',alignItems:'flex-start',alignSelf:'center',width:'88%',backgroundColor:'#f7e7cb',borderWidth:6,borderColor:'#a9cbe6',borderRadius:44,paddingVertical:16,elevation:6},
  col:{alignItems:'center'},
  clue:{width:66,height:66,borderRadius:33,backgroundColor:'#a8e22a',borderWidth:4,borderColor:'#d6f58a',alignItems:'center',justifyContent:'center'},
  video:{width:66,height:66,borderRadius:33,backgroundColor:'#fff',borderWidth:4,borderColor:'#eadfc9',alignItems:'center',justifyContent:'center'},
  skip:{width:66,height:66,borderRadius:33,backgroundColor:'#f0484f',borderWidth:4,borderColor:'#fff',alignItems:'center',justifyContent:'center'},
  pill:{flexDirection:'row',alignItems:'center',gap:4,height:26,marginTop:8,paddingHorizontal:14,borderRadius:13,backgroundColor:'#6b4423'},
  pt:{fontFamily:F,fontSize:15,fontWeight:'bold',color:'#fff'}});