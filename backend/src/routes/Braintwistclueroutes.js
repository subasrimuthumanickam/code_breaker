// backend/src/routes/Braintwistclueroutes.js
const express=require('express');
const router=express.Router();
const {getClue}=require('../data/Cluedb');

// POST /api/braintwist/clue   body: { playerId, level, clueNo? }
router.post('/',async(req,res)=>{
  const playerId=Number(req.body?.playerId);
  const level=Number(req.body?.level);
  const clueNo=Number(req.body?.clueNo)||1;

  if(!Number.isInteger(playerId)||playerId<=0||!Number.isInteger(level)||level<=0){
    return res.status(400).json({success:false,message:'playerId and level are required'});
  }
  try{
    const data=await getClue(playerId,level,clueNo);
    return res.json({success:true,...data});
  }catch(err){
    console.error('clue error:',err);
    return res.status(500).json({success:false,message:'Server error'});
  }});

module.exports=router;