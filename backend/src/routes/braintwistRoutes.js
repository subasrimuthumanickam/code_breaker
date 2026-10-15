// // // // // const r=require('express').Router(),db=require('../db');
// // // // // const TOTAL=3,COST={hint:25,skip:50},REWARD={video:75,gift:25};
// // // // // const h=fn=>(q,s)=>fn(q,s).catch(e=>{console.error(e);s.status(500).json({error:'server_error'})});
// // // // // const one=async(sql,p)=>(await db.query(sql,p))[0][0];
// // // // // const J=v=>{while(typeof v==='string'){try{v=JSON.parse(v)}catch(e){break}}return v};
// // // // // const pv=p=>({id:p.id,hints:p.hints,currentLevel:Math.min(p.current_level,TOTAL),finished:p.current_level>TOTAL});
// // // // // const lvl=async n=>{const l=await one('SELECT * FROM bt_levels WHERE n=?',[n]);if(l){l.config=J(l.config);l.answer=J(l.answer)}return l};
// // // // // const spend=async(id,c)=>(await db.query('UPDATE bt_players SET hints=hints-? WHERE id=? AND hints>=?',[c,id,c]))[0].affectedRows>0;
// // // // // const solve=async(id,n)=>{await db.query('INSERT INTO bt_progress(player_id,level_n,attempts,solved_at) VALUES(?,?,0,NOW()) ON DUPLICATE KEY UPDATE solved_at=NOW()',[id,n]);
// // // // //   await db.query('UPDATE bt_players SET current_level=GREATEST(current_level,?) WHERE id=?',[n+1,id])};
// // // // // const ok=(l,a)=>{const k=l.answer.v;if(l.type==='drag')return !!a&&a.from===k.from&&a.to===k.to;if(l.type==='taps')return Number(a)>=k;return Number(a)===k};

// // // // // r.post('/players/guest',h(async(q,s)=>{const d=String(q.body.deviceId||'').slice(0,64);if(!d)return s.status(400).json({error:'deviceId required'});
// // // // //   await db.query('INSERT IGNORE INTO bt_players(device_id) VALUES(?)',[d]);s.json(pv(await one('SELECT * FROM bt_players WHERE device_id=?',[d])))}));
// // // // // r.get('/players/:id',h(async(q,s)=>{const p=await one('SELECT * FROM bt_players WHERE id=?',[q.params.id]);p?s.json(pv(p)):s.status(404).json({error:'no_player'})}));
// // // // // r.post('/players/:id/reward',h(async(q,s)=>{const a=REWARD[q.body.kind];if(!a)return s.status(400).json({error:'bad_kind'});
// // // // //   await db.query('UPDATE bt_players SET hints=hints+? WHERE id=?',[a,q.params.id]);s.json(pv(await one('SELECT * FROM bt_players WHERE id=?',[q.params.id])))}));
// // // // // // Level payload never contains the answer
// // // // // r.get('/levels/:n',h(async(q,s)=>{const l=await lvl(q.params.n);if(!l)return s.status(404).json({error:'no_level'});
// // // // //   s.json({n:l.n,type:l.type,question:l.question,total:TOTAL,...l.config})}));
// // // // // r.post('/levels/:n/answer',h(async(q,s)=>{const{playerId,answer}=q.body,l=await lvl(q.params.n);if(!l)return s.status(404).json({error:'no_level'});
// // // // //   await db.query('INSERT INTO bt_progress(player_id,level_n,attempts) VALUES(?,?,1) ON DUPLICATE KEY UPDATE attempts=attempts+1',[playerId,l.n]);
// // // // //   if(!ok(l,answer))return s.json({correct:false});
// // // // //   await solve(playerId,l.n);s.json({correct:true,message:l.answer.msg,next:l.n<TOTAL?l.n+1:null})}));
// // // // // r.post('/levels/:n/hint',h(async(q,s)=>{const{playerId,used=[]}=q.body,l=await lvl(q.params.n);if(!l)return s.status(404).json({error:'no_level'});
// // // // //   if(!(await spend(playerId,COST.hint)))return s.status(402).json({error:'not_enough_hints'});
// // // // //   let hint;if(l.type==='choice'){const w=l.config.items.map((_,i)=>i).filter(i=>i!==l.answer.v&&!used.includes(i));hint={remove:w[0]??null}}
// // // // //   else hint={text:'Look closely at what you can touch!'};
// // // // //   s.json({hint,hints:(await one('SELECT hints FROM bt_players WHERE id=?',[playerId])).hints})}));
// // // // // r.post('/levels/:n/skip',h(async(q,s)=>{const{playerId}=q.body,l=await lvl(q.params.n);if(!l)return s.status(404).json({error:'no_level'});
// // // // //   if(!(await spend(playerId,COST.skip)))return s.status(402).json({error:'not_enough_hints'});
// // // // //   await solve(playerId,l.n);s.json({correct:true,message:'Skipped!',next:l.n<TOTAL?l.n+1:null})}));
// // // // // module.exports=r;

// // // // const express = require('express');
// // // // const db = require('../db');

// // // // const r = express.Router();

// // // // const TOTAL = 7;

// // // // const COST = {
// // // //   hint: 25,
// // // //   skip: 50,
// // // // };

// // // // const REWARD = {
// // // //   video: 75,
// // // //   gift: 25,
// // // // };

// // // // const handle = (fn) => async (req, res) => {
// // // //   try {
// // // //     await fn(req, res);
// // // //   } catch (err) {
// // // //     console.error('[BrainTwist API Error]', req.method, req.originalUrl, err);
// // // //     if (!res.headersSent) {
// // // //       res.status(500).json({
// // // //         error: 'server_error',
// // // //         message: err.message,
// // // //       });
// // // //     }
// // // //   }
// // // // };

// // // // // MySQL query helper: expects mysql2/promise
// // // // const one = async (sql, params = []) => {
// // // //   const [rows] = await db.query(sql, params);
// // // //   return rows[0] || null;
// // // // };

// // // // const parseJSON = (value) => {
// // // //   while (typeof value === 'string') {
// // // //     try {
// // // //       value = JSON.parse(value);
// // // //     } catch {
// // // //       break;
// // // //     }
// // // //   }
// // // //   return value;
// // // // };

// // // // const playerResponse = (p) => {
// // // //   if (!p) return null;

// // // //   const currentLevel = Math.max(
// // // //     1,
// // // //     Number(p.current_level) || 1
// // // //   );

// // // //   return {
// // // //     id: p.id,
// // // //     hints: Number(p.hints) || 0,
// // // //     currentLevel: Math.min(currentLevel, TOTAL),
// // // //     finished: currentLevel > TOTAL,
// // // //     total: TOTAL,
// // // //   };
// // // // };

// // // // const getLevel = async (n) => {
// // // //   const levelNumber = Number(n);

// // // //   if (
// // // //     !Number.isInteger(levelNumber) ||
// // // //     levelNumber < 1 ||
// // // //     levelNumber > TOTAL
// // // //   ) {
// // // //     return null;
// // // //   }

// // // //   const l = await one(
// // // //     'SELECT * FROM bt_levels WHERE n = ?',
// // // //     [levelNumber]
// // // //   );

// // // //   if (!l) return null;

// // // //   l.config = parseJSON(l.config);
// // // //   l.answer = parseJSON(l.answer);

// // // //   return l;
// // // // };

// // // // const spendHints = async (playerId, amount) => {
// // // //   const [result] = await db.query(
// // // //     `UPDATE bt_players
// // // //      SET hints = hints - ?
// // // //      WHERE id = ? AND hints >= ?`,
// // // //     [amount, playerId, amount]
// // // //   );

// // // //   return result.affectedRows > 0;
// // // // };

// // // // const solveLevel = async (playerId, levelNumber) => {
// // // //   await db.query(
// // // //     `INSERT INTO bt_progress
// // // //       (player_id, level_n, attempts, solved_at)
// // // //      VALUES (?, ?, 0, NOW())
// // // //      ON DUPLICATE KEY UPDATE solved_at = NOW()`,
// // // //     [playerId, levelNumber]
// // // //   );

// // // //   await db.query(
// // // //     `UPDATE bt_players
// // // //      SET current_level = GREATEST(
// // // //        COALESCE(current_level, 1), ?
// // // //      )
// // // //      WHERE id = ?`,
// // // //     [levelNumber + 1, playerId]
// // // //   );
// // // // };

// // // // const validPlayer = async (playerId) => {
// // // //   if (!Number.isInteger(Number(playerId)) || Number(playerId) < 1) {
// // // //     return false;
// // // //   }

// // // //   return Boolean(
// // // //     await one('SELECT id FROM bt_players WHERE id = ?', [
// // // //       Number(playerId),
// // // //     ])
// // // //   );
// // // // };

// // // // const isCorrect = (l, answer) => {
// // // //   if (!l || !l.answer) return false;

// // // //   const expected = l.answer.v;

// // // //   if (l.type === 'drag') {
// // // //     return (
// // // //       answer &&
// // // //       Number(answer.from) === Number(expected.from) &&
// // // //       Number(answer.to) === Number(expected.to)
// // // //     );
// // // //   }

// // // //   if (l.type === 'taps') {
// // // //     return Number(answer) >= Number(expected);
// // // //   }

// // // //   return Number(answer) === Number(expected);
// // // // };

// // // // // Health check
// // // // r.get('/health', (req, res) => {
// // // //   res.json({
// // // //     success: true,
// // // //     game: 'Brain Twist',
// // // //     totalLevels: TOTAL,
// // // //   });
// // // // });

// // // // // Create or retrieve guest player
// // // // r.post('/players/guest', handle(async (req, res) => {
// // // //   const deviceId = String(req.body?.deviceId || '').slice(0, 64);

// // // //   if (!deviceId) {
// // // //     return res.status(400).json({
// // // //       error: 'deviceId_required',
// // // //     });
// // // //   }

// // // //   await db.query(
// // // //     'INSERT IGNORE INTO bt_players (device_id) VALUES (?)',
// // // //     [deviceId]
// // // //   );

// // // //   const player = await one(
// // // //     'SELECT * FROM bt_players WHERE device_id = ?',
// // // //     [deviceId]
// // // //   );

// // // //   if (!player) {
// // // //     return res.status(500).json({
// // // //       error: 'player_creation_failed',
// // // //     });
// // // //   }

// // // //   res.json(playerResponse(player));
// // // // }));

// // // // // Get player progress
// // // // r.get('/players/:id', handle(async (req, res) => {
// // // //   const player = await one(
// // // //     'SELECT * FROM bt_players WHERE id = ?',
// // // //     [req.params.id]
// // // //   );

// // // //   if (!player) {
// // // //     return res.status(404).json({
// // // //       error: 'no_player',
// // // //     });
// // // //   }

// // // //   res.json(playerResponse(player));
// // // // }));

// // // // // Rewards
// // // // r.post('/players/:id/reward', handle(async (req, res) => {
// // // //   const rewardAmount = REWARD[req.body?.kind];

// // // //   if (!rewardAmount) {
// // // //     return res.status(400).json({
// // // //       error: 'bad_kind',
// // // //     });
// // // //   }

// // // //   const playerId = Number(req.params.id);

// // // //   if (!(await validPlayer(playerId))) {
// // // //     return res.status(404).json({
// // // //       error: 'no_player',
// // // //     });
// // // //   }

// // // //   await db.query(
// // // //     'UPDATE bt_players SET hints = hints + ? WHERE id = ?',
// // // //     [rewardAmount, playerId]
// // // //   );

// // // //   const player = await one(
// // // //     'SELECT * FROM bt_players WHERE id = ?',
// // // //     [playerId]
// // // //   );

// // // //   res.json(playerResponse(player));
// // // // }));

// // // // // Get level data. Never send the answer to the frontend.
// // // // r.get('/levels/:n', handle(async (req, res) => {
// // // //   const l = await getLevel(req.params.n);

// // // //   if (!l) {
// // // //     return res.status(404).json({
// // // //       error: 'no_level',
// // // //       message: `Level ${req.params.n} was not found`,
// // // //     });
// // // //   }

// // // //   res.json({
// // // //     n: Number(l.n),
// // // //     type: l.type,
// // // //     question: l.question,
// // // //     total: TOTAL,
// // // //     ...(l.config || {}),
// // // //   });
// // // // }));

// // // // // Submit an answer
// // // // r.post('/levels/:n/answer', handle(async (req, res) => {
// // // //   const playerId = Number(req.body?.playerId);
// // // //   const answer = req.body?.answer;
// // // //   const l = await getLevel(req.params.n);

// // // //   if (!l) {
// // // //     return res.status(404).json({
// // // //       error: 'no_level',
// // // //     });
// // // //   }

// // // //   if (!(await validPlayer(playerId))) {
// // // //     return res.status(404).json({
// // // //       error: 'no_player',
// // // //     });
// // // //   }

// // // //   if (answer === undefined || answer === null) {
// // // //     return res.status(400).json({
// // // //       error: 'answer_required',
// // // //     });
// // // //   }

// // // //   await db.query(
// // // //     `INSERT INTO bt_progress
// // // //       (player_id, level_n, attempts)
// // // //      VALUES (?, ?, 1)
// // // //      ON DUPLICATE KEY UPDATE attempts = attempts + 1`,
// // // //     [playerId, l.n]
// // // //   );

// // // //   if (!isCorrect(l, answer)) {
// // // //     return res.json({
// // // //       correct: false,
// // // //     });
// // // //   }

// // // //   await solveLevel(playerId, Number(l.n));

// // // //   res.json({
// // // //     correct: true,
// // // //     message: l.answer.msg || 'Correct!',
// // // //     next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
// // // //     finished: Number(l.n) === TOTAL,
// // // //   });
// // // // }));

// // // // // Use a hint
// // // // r.post('/levels/:n/hint', handle(async (req, res) => {
// // // //   const playerId = Number(req.body?.playerId);
// // // //   const used = Array.isArray(req.body?.used)
// // // //     ? req.body.used.map(Number)
// // // //     : [];

// // // //   const l = await getLevel(req.params.n);

// // // //   if (!l) {
// // // //     return res.status(404).json({
// // // //       error: 'no_level',
// // // //     });
// // // //   }

// // // //   if (!(await validPlayer(playerId))) {
// // // //     return res.status(404).json({
// // // //       error: 'no_player',
// // // //     });
// // // //   }

// // // //   if (!(await spendHints(playerId, COST.hint))) {
// // // //     return res.status(402).json({
// // // //       error: 'not_enough_hints',
// // // //     });
// // // //   }

// // // //   let hint;

// // // //   if (l.type === 'choice') {
// // // //     const items = l.config?.items || [];
// // // //     const correctIndex = Number(l.answer.v);

// // // //     const removable = items
// // // //       .map((_, index) => index)
// // // //       .filter(
// // // //         (index) =>
// // // //           index !== correctIndex && !used.includes(index)
// // // //       );

// // // //     hint = {
// // // //       remove: removable.length ? removable[0] : null,
// // // //     };
// // // //   } else {
// // // //     hint = {
// // // //       text: 'Look closely at what you can touch!',
// // // //     };
// // // //   }

// // // //   const player = await one(
// // // //     'SELECT hints FROM bt_players WHERE id = ?',
// // // //     [playerId]
// // // //   );

// // // //   res.json({
// // // //     hint,
// // // //     hints: Number(player?.hints) || 0,
// // // //   });
// // // // }));

// // // // // Skip a level
// // // // r.post('/levels/:n/skip', handle(async (req, res) => {
// // // //   const playerId = Number(req.body?.playerId);
// // // //   const l = await getLevel(req.params.n);

// // // //   if (!l) {
// // // //     return res.status(404).json({
// // // //       error: 'no_level',
// // // //     });
// // // //   }

// // // //   if (!(await validPlayer(playerId))) {
// // // //     return res.status(404).json({
// // // //       error: 'no_player',
// // // //     });
// // // //   }

// // // //   if (!(await spendHints(playerId, COST.skip))) {
// // // //     return res.status(402).json({
// // // //       error: 'not_enough_hints',
// // // //     });
// // // //   }

// // // //   await solveLevel(playerId, Number(l.n));

// // // //   res.json({
// // // //     correct: true,
// // // //     message: 'Skipped!',
// // // //     next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
// // // //     finished: Number(l.n) === TOTAL,
// // // //   });
// // // // }));

// // // // module.exports = r;
// // // const express = require('express');
// // // const db = require('../db');

// // // const r = express.Router();

// // // const TOTAL = 7;

// // // const COST = {
// // //   hint: 25,
// // //   skip: 50,
// // // };

// // // const REWARD = {
// // //   video: 75,
// // //   gift: 25,
// // // };

// // // const handle = (fn) => async (req, res) => {
// // //   try {
// // //     await fn(req, res);
// // //   } catch (err) {
// // //     console.error('[BrainTwist API Error]', req.method, req.originalUrl, err);
// // //     if (!res.headersSent) {
// // //       res.status(500).json({
// // //         error: 'server_error',
// // //         message: err.message,
// // //       });
// // //     }
// // //   }
// // // };

// // // // MySQL query helper: expects mysql2/promise
// // // const one = async (sql, params = []) => {
// // //   const [rows] = await db.query(sql, params);
// // //   return rows[0] || null;
// // // };

// // // const parseJSON = (value) => {
// // //   while (typeof value === 'string') {
// // //     try {
// // //       value = JSON.parse(value);
// // //     } catch {
// // //       break;
// // //     }
// // //   }
// // //   return value;
// // // };

// // // const playerResponse = (p) => {
// // //   if (!p) return null;

// // //   const currentLevel = Math.max(
// // //     1,
// // //     Number(p.current_level) || 1
// // //   );

// // //   return {
// // //     id: p.id,
// // //     hints: Number(p.hints) || 0,
// // //     currentLevel: Math.min(currentLevel, TOTAL),
// // //     finished: currentLevel > TOTAL,
// // //     total: TOTAL,
// // //   };
// // // };

// // // const getLevel = async (n) => {
// // //   const levelNumber = Number(n);

// // //   if (
// // //     !Number.isInteger(levelNumber) ||
// // //     levelNumber < 1 ||
// // //     levelNumber > TOTAL
// // //   ) {
// // //     return null;
// // //   }

// // //   const l = await one(
// // //     'SELECT * FROM bt_levels WHERE n = ?',
// // //     [levelNumber]
// // //   );

// // //   if (!l) return null;

// // //   l.config = parseJSON(l.config);
// // //   l.answer = parseJSON(l.answer);

// // //   return l;
// // // };

// // // const spendHints = async (playerId, amount) => {
// // //   const [result] = await db.query(
// // //     `UPDATE bt_players
// // //      SET hints = hints - ?
// // //      WHERE id = ? AND hints >= ?`,
// // //     [amount, playerId, amount]
// // //   );

// // //   return result.affectedRows > 0;
// // // };

// // // const solveLevel = async (playerId, levelNumber) => {
// // //   await db.query(
// // //     `INSERT INTO bt_progress
// // //       (player_id, level_n, attempts, solved_at)
// // //      VALUES (?, ?, 0, NOW())
// // //      ON DUPLICATE KEY UPDATE solved_at = NOW()`,
// // //     [playerId, levelNumber]
// // //   );

// // //   await db.query(
// // //     `UPDATE bt_players
// // //      SET current_level = GREATEST(
// // //        COALESCE(current_level, 1), ?
// // //      )
// // //      WHERE id = ?`,
// // //     [levelNumber + 1, playerId]
// // //   );
// // // };

// // // const validPlayer = async (playerId) => {
// // //   if (!Number.isInteger(Number(playerId)) || Number(playerId) < 1) {
// // //     return false;
// // //   }

// // //   return Boolean(
// // //     await one('SELECT id FROM bt_players WHERE id = ?', [
// // //       Number(playerId),
// // //     ])
// // //   );
// // // };

// // // const isCorrect = (l, answer) => {
// // //   if (!l || !l.answer) return false;

// // //   const expected = l.answer.v;

// // //   if (l.type === 'drag') {
// // //     return (
// // //       answer &&
// // //       Number(answer.from) === Number(expected.from) &&
// // //       Number(answer.to) === Number(expected.to)
// // //     );
// // //   }

// // //   if (l.type === 'taps') {
// // //     return Number(answer) >= Number(expected);
// // //   }

// // //   return Number(answer) === Number(expected);
// // // };

// // // // Health check
// // // r.get('/health', (req, res) => {
// // //   res.json({
// // //     success: true,
// // //     game: 'Brain Twist',
// // //     totalLevels: TOTAL,
// // //   });
// // // });

// // // // Create or retrieve guest player
// // // r.post('/players/guest', handle(async (req, res) => {
// // //   const deviceId = String(req.body?.deviceId || '').slice(0, 64);

// // //   if (!deviceId) {
// // //     return res.status(400).json({
// // //       error: 'deviceId_required',
// // //     });
// // //   }

// // //   await db.query(
// // //     'INSERT IGNORE INTO bt_players (device_id) VALUES (?)',
// // //     [deviceId]
// // //   );

// // //   const player = await one(
// // //     'SELECT * FROM bt_players WHERE device_id = ?',
// // //     [deviceId]
// // //   );

// // //   if (!player) {
// // //     return res.status(500).json({
// // //       error: 'player_creation_failed',
// // //     });
// // //   }

// // //   res.json(playerResponse(player));
// // // }));

// // // // Get player progress
// // // r.get('/players/:id', handle(async (req, res) => {
// // //   const player = await one(
// // //     'SELECT * FROM bt_players WHERE id = ?',
// // //     [req.params.id]
// // //   );

// // //   if (!player) {
// // //     return res.status(404).json({
// // //       error: 'no_player',
// // //     });
// // //   }

// // //   res.json(playerResponse(player));
// // // }));

// // // // Rewards
// // // r.post('/players/:id/reward', handle(async (req, res) => {
// // //   const rewardAmount = REWARD[req.body?.kind];

// // //   if (!rewardAmount) {
// // //     return res.status(400).json({
// // //       error: 'bad_kind',
// // //     });
// // //   }

// // //   const playerId = Number(req.params.id);

// // //   if (!(await validPlayer(playerId))) {
// // //     return res.status(404).json({
// // //       error: 'no_player',
// // //     });
// // //   }

// // //   await db.query(
// // //     'UPDATE bt_players SET hints = hints + ? WHERE id = ?',
// // //     [rewardAmount, playerId]
// // //   );

// // //   const player = await one(
// // //     'SELECT * FROM bt_players WHERE id = ?',
// // //     [playerId]
// // //   );

// // //   res.json(playerResponse(player));
// // // }));

// // // // Get level data. Never send the answer (or the hint text) to the frontend.
// // // r.get('/levels/:n', handle(async (req, res) => {
// // //   const l = await getLevel(req.params.n);

// // //   if (!l) {
// // //     return res.status(404).json({
// // //       error: 'no_level',
// // //       message: `Level ${req.params.n} was not found`,
// // //     });
// // //   }

// // //   const { hint: _hint, ...cfg } = l.config || {};

// // //   res.json({
// // //     n: Number(l.n),
// // //     type: l.type,
// // //     question: l.question,
// // //     total: TOTAL,
// // //     ...cfg,
// // //   });
// // // }));

// // // // Submit an answer
// // // r.post('/levels/:n/answer', handle(async (req, res) => {
// // //   const playerId = Number(req.body?.playerId);
// // //   const answer = req.body?.answer;
// // //   const l = await getLevel(req.params.n);

// // //   if (!l) {
// // //     return res.status(404).json({
// // //       error: 'no_level',
// // //     });
// // //   }

// // //   if (!(await validPlayer(playerId))) {
// // //     return res.status(404).json({
// // //       error: 'no_player',
// // //     });
// // //   }

// // //   if (answer === undefined || answer === null) {
// // //     return res.status(400).json({
// // //       error: 'answer_required',
// // //     });
// // //   }

// // //   await db.query(
// // //     `INSERT INTO bt_progress
// // //       (player_id, level_n, attempts)
// // //      VALUES (?, ?, 1)
// // //      ON DUPLICATE KEY UPDATE attempts = attempts + 1`,
// // //     [playerId, l.n]
// // //   );

// // //   if (!isCorrect(l, answer)) {
// // //     return res.json({
// // //       correct: false,
// // //     });
// // //   }

// // //   await solveLevel(playerId, Number(l.n));

// // //   res.json({
// // //     correct: true,
// // //     message: l.answer.msg || 'Correct!',
// // //     next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
// // //     finished: Number(l.n) === TOTAL,
// // //   });
// // // }));

// // // // Use a hint
// // // r.post('/levels/:n/hint', handle(async (req, res) => {
// // //   const playerId = Number(req.body?.playerId);
// // //   const used = Array.isArray(req.body?.used)
// // //     ? req.body.used.map(Number)
// // //     : [];

// // //   const l = await getLevel(req.params.n);

// // //   if (!l) {
// // //     return res.status(404).json({
// // //       error: 'no_level',
// // //     });
// // //   }

// // //   if (!(await validPlayer(playerId))) {
// // //     return res.status(404).json({
// // //       error: 'no_player',
// // //     });
// // //   }

// // //   if (!(await spendHints(playerId, COST.hint))) {
// // //     return res.status(402).json({
// // //       error: 'not_enough_hints',
// // //     });
// // //   }

// // //   let hint;
// // //   const options = l.config?.options;

// // //   if (l.type === 'choice' && Array.isArray(options)) {
// // //     // number options (pizza count, racer position...): remove one wrong number
// // //     const correct = Number(l.answer.v);

// // //     const removable = options
// // //       .map(Number)
// // //       .filter((o) => o !== correct && !used.includes(o));

// // //     hint = removable.length
// // //       ? { removeOption: removable[0] }
// // //       : { text: l.config?.hint || 'Think about it once more!' };
// // //   } else if (l.type === 'choice') {
// // //     // tap-an-item levels: fade one wrong item
// // //     const items = l.config?.items || [];
// // //     const correctIndex = Number(l.answer.v);

// // //     const removable = items
// // //       .map((_, index) => index)
// // //       .filter(
// // //         (index) =>
// // //           index !== correctIndex && !used.includes(index)
// // //       );

// // //     hint = removable.length
// // //       ? { remove: removable[0] }
// // //       : { text: l.config?.hint || 'Think about it once more!' };
// // //   } else {
// // //     hint = {
// // //       text: l.config?.hint || 'Look closely at what you can touch!',
// // //     };
// // //   }

// // //   const player = await one(
// // //     'SELECT hints FROM bt_players WHERE id = ?',
// // //     [playerId]
// // //   );

// // //   res.json({
// // //     hint,
// // //     hints: Number(player?.hints) || 0,
// // //   });
// // // }));

// // // // Skip a level
// // // r.post('/levels/:n/skip', handle(async (req, res) => {
// // //   const playerId = Number(req.body?.playerId);
// // //   const l = await getLevel(req.params.n);

// // //   if (!l) {
// // //     return res.status(404).json({
// // //       error: 'no_level',
// // //     });
// // //   }

// // //   if (!(await validPlayer(playerId))) {
// // //     return res.status(404).json({
// // //       error: 'no_player',
// // //     });
// // //   }

// // //   if (!(await spendHints(playerId, COST.skip))) {
// // //     return res.status(402).json({
// // //       error: 'not_enough_hints',
// // //     });
// // //   }

// // //   await solveLevel(playerId, Number(l.n));

// // //   res.json({
// // //     correct: true,
// // //     message: 'Skipped!',
// // //     next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
// // //     finished: Number(l.n) === TOTAL,
// // //   });
// // // }));

// // // module.exports = r;
// // const express = require('express');
// // const db = require('../db');

// // const r = express.Router();

// // // total levels = highest level number found in bt_levels (updated on every request)
// // let TOTAL = 7;

// // const COST = {
// //   hint: 25,
// //   skip: 50,
// // };

// // const REWARD = {
// //   video: 75,
// //   gift: 25,
// // };

// // const handle = (fn) => async (req, res) => {
// //   try {
// //     await fn(req, res);
// //   } catch (err) {
// //     console.error('[BrainTwist API Error]', req.method, req.originalUrl, err);
// //     if (!res.headersSent) {
// //       res.status(500).json({
// //         error: 'server_error',
// //         message: err.message,
// //       });
// //     }
// //   }
// // };

// // // MySQL query helper: expects mysql2/promise
// // const one = async (sql, params = []) => {
// //   const [rows] = await db.query(sql, params);
// //   return rows[0] || null;
// // };

// // const parseJSON = (value) => {
// //   while (typeof value === 'string') {
// //     try {
// //       value = JSON.parse(value);
// //     } catch {
// //       break;
// //     }
// //   }
// //   return value;
// // };

// // const playerResponse = (p) => {
// //   if (!p) return null;

// //   const currentLevel = Math.max(
// //     1,
// //     Number(p.current_level) || 1
// //   );

// //   return {
// //     id: p.id,
// //     hints: Number(p.hints) || 0,
// //     currentLevel: Math.min(currentLevel, TOTAL),
// //     finished: currentLevel > TOTAL,
// //     total: TOTAL,
// //   };
// // };

// // const getLevel = async (n) => {
// //   const levelNumber = Number(n);

// //   if (
// //     !Number.isInteger(levelNumber) ||
// //     levelNumber < 1 ||
// //     levelNumber > TOTAL
// //   ) {
// //     return null;
// //   }

// //   const l = await one(
// //     'SELECT * FROM bt_levels WHERE n = ?',
// //     [levelNumber]
// //   );

// //   if (!l) return null;

// //   l.config = parseJSON(l.config);
// //   l.answer = parseJSON(l.answer);

// //   return l;
// // };

// // const spendHints = async (playerId, amount) => {
// //   const [result] = await db.query(
// //     `UPDATE bt_players
// //      SET hints = hints - ?
// //      WHERE id = ? AND hints >= ?`,
// //     [amount, playerId, amount]
// //   );

// //   return result.affectedRows > 0;
// // };

// // const solveLevel = async (playerId, levelNumber) => {
// //   await db.query(
// //     `INSERT INTO bt_progress
// //       (player_id, level_n, attempts, solved_at)
// //      VALUES (?, ?, 0, NOW())
// //      ON DUPLICATE KEY UPDATE solved_at = NOW()`,
// //     [playerId, levelNumber]
// //   );

// //   await db.query(
// //     `UPDATE bt_players
// //      SET current_level = GREATEST(
// //        COALESCE(current_level, 1), ?
// //      )
// //      WHERE id = ?`,
// //     [levelNumber + 1, playerId]
// //   );
// // };

// // const validPlayer = async (playerId) => {
// //   if (!Number.isInteger(Number(playerId)) || Number(playerId) < 1) {
// //     return false;
// //   }

// //   return Boolean(
// //     await one('SELECT id FROM bt_players WHERE id = ?', [
// //       Number(playerId),
// //     ])
// //   );
// // };

// // const isCorrect = (l, answer) => {
// //   if (!l || !l.answer) return false;

// //   const expected = l.answer.v;

// //   if (l.type === 'drag') {
// //     return (
// //       answer &&
// //       Number(answer.from) === Number(expected.from) &&
// //       Number(answer.to) === Number(expected.to)
// //     );
// //   }

// //   if (l.type === 'taps') {
// //     return Number(answer) >= Number(expected);
// //   }

// //   return Number(answer) === Number(expected);
// // };

// // // keep TOTAL in sync with the database
// // r.use(async (req, res, next) => {
// //   try {
// //     const row = await one('SELECT MAX(n) AS m FROM bt_levels');
// //     if (row && Number(row.m) > 0) TOTAL = Number(row.m);
// //   } catch (err) {
// //     console.error('[BrainTwist] could not read total levels:', err.message);
// //   }
// //   next();
// // });

// // // Health check
// // r.get('/health', (req, res) => {
// //   res.json({
// //     success: true,
// //     game: 'Brain Twist',
// //     totalLevels: TOTAL,
// //   });
// // });

// // // Create or retrieve guest player
// // r.post('/players/guest', handle(async (req, res) => {
// //   const deviceId = String(req.body?.deviceId || '').slice(0, 64);

// //   if (!deviceId) {
// //     return res.status(400).json({
// //       error: 'deviceId_required',
// //     });
// //   }

// //   await db.query(
// //     'INSERT IGNORE INTO bt_players (device_id) VALUES (?)',
// //     [deviceId]
// //   );

// //   const player = await one(
// //     'SELECT * FROM bt_players WHERE device_id = ?',
// //     [deviceId]
// //   );

// //   if (!player) {
// //     return res.status(500).json({
// //       error: 'player_creation_failed',
// //     });
// //   }

// //   res.json(playerResponse(player));
// // }));

// // // Get player progress
// // r.get('/players/:id', handle(async (req, res) => {
// //   const player = await one(
// //     'SELECT * FROM bt_players WHERE id = ?',
// //     [req.params.id]
// //   );

// //   if (!player) {
// //     return res.status(404).json({
// //       error: 'no_player',
// //     });
// //   }

// //   res.json(playerResponse(player));
// // }));

// // // Rewards
// // r.post('/players/:id/reward', handle(async (req, res) => {
// //   const rewardAmount = REWARD[req.body?.kind];

// //   if (!rewardAmount) {
// //     return res.status(400).json({
// //       error: 'bad_kind',
// //     });
// //   }

// //   const playerId = Number(req.params.id);

// //   if (!(await validPlayer(playerId))) {
// //     return res.status(404).json({
// //       error: 'no_player',
// //     });
// //   }

// //   await db.query(
// //     'UPDATE bt_players SET hints = hints + ? WHERE id = ?',
// //     [rewardAmount, playerId]
// //   );

// //   const player = await one(
// //     'SELECT * FROM bt_players WHERE id = ?',
// //     [playerId]
// //   );

// //   res.json(playerResponse(player));
// // }));

// // // Get level data. Never send the answer (or the hint text) to the frontend.
// // r.get('/levels/:n', handle(async (req, res) => {
// //   const l = await getLevel(req.params.n);

// //   if (!l) {
// //     return res.status(404).json({
// //       error: 'no_level',
// //       message: `Level ${req.params.n} was not found`,
// //     });
// //   }

// //   const { hint: _hint, ...cfg } = l.config || {};

// //   res.json({
// //     n: Number(l.n),
// //     type: l.type,
// //     question: l.question,
// //     total: TOTAL,
// //     ...cfg,
// //   });
// // }));

// // // Submit an answer
// // r.post('/levels/:n/answer', handle(async (req, res) => {
// //   const playerId = Number(req.body?.playerId);
// //   const answer = req.body?.answer;
// //   const l = await getLevel(req.params.n);

// //   if (!l) {
// //     return res.status(404).json({
// //       error: 'no_level',
// //     });
// //   }

// //   if (!(await validPlayer(playerId))) {
// //     return res.status(404).json({
// //       error: 'no_player',
// //     });
// //   }

// //   if (answer === undefined || answer === null) {
// //     return res.status(400).json({
// //       error: 'answer_required',
// //     });
// //   }

// //   await db.query(
// //     `INSERT INTO bt_progress
// //       (player_id, level_n, attempts)
// //      VALUES (?, ?, 1)
// //      ON DUPLICATE KEY UPDATE attempts = attempts + 1`,
// //     [playerId, l.n]
// //   );

// //   if (!isCorrect(l, answer)) {
// //     return res.json({
// //       correct: false,
// //     });
// //   }

// //   await solveLevel(playerId, Number(l.n));

// //   res.json({
// //     correct: true,
// //     message: l.answer.msg || 'Correct!',
// //     next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
// //     finished: Number(l.n) === TOTAL,
// //   });
// // }));

// // // Use a hint
// // r.post('/levels/:n/hint', handle(async (req, res) => {
// //   const playerId = Number(req.body?.playerId);
// //   const used = Array.isArray(req.body?.used)
// //     ? req.body.used.map(Number)
// //     : [];

// //   const l = await getLevel(req.params.n);

// //   if (!l) {
// //     return res.status(404).json({
// //       error: 'no_level',
// //     });
// //   }

// //   if (!(await validPlayer(playerId))) {
// //     return res.status(404).json({
// //       error: 'no_player',
// //     });
// //   }

// //   if (!(await spendHints(playerId, COST.hint))) {
// //     return res.status(402).json({
// //       error: 'not_enough_hints',
// //     });
// //   }

// //   let hint;
// //   const options = l.config?.options;

// //   if (l.type === 'choice' && Array.isArray(options)) {
// //     // number options (pizza count, racer position...): remove one wrong number
// //     const correct = Number(l.answer.v);

// //     const removable = options
// //       .map(Number)
// //       .filter((o) => o !== correct && !used.includes(o));

// //     hint = removable.length
// //       ? { removeOption: removable[0] }
// //       : { text: l.config?.hint || 'Think about it once more!' };
// //   } else if (l.type === 'choice') {
// //     // tap-an-item levels: fade one wrong item
// //     const items = l.config?.items || [];
// //     const correctIndex = Number(l.answer.v);

// //     const removable = items
// //       .map((_, index) => index)
// //       .filter(
// //         (index) =>
// //           index !== correctIndex && !used.includes(index)
// //       );

// //     hint = removable.length
// //       ? { remove: removable[0] }
// //       : { text: l.config?.hint || 'Think about it once more!' };
// //   } else {
// //     hint = {
// //       text: l.config?.hint || 'Look closely at what you can touch!',
// //     };
// //   }

// //   const player = await one(
// //     'SELECT hints FROM bt_players WHERE id = ?',
// //     [playerId]
// //   );

// //   res.json({
// //     hint,
// //     hints: Number(player?.hints) || 0,
// //   });
// // }));

// // // Skip a level
// // r.post('/levels/:n/skip', handle(async (req, res) => {
// //   const playerId = Number(req.body?.playerId);
// //   const l = await getLevel(req.params.n);

// //   if (!l) {
// //     return res.status(404).json({
// //       error: 'no_level',
// //     });
// //   }

// //   if (!(await validPlayer(playerId))) {
// //     return res.status(404).json({
// //       error: 'no_player',
// //     });
// //   }

// //   if (!(await spendHints(playerId, COST.skip))) {
// //     return res.status(402).json({
// //       error: 'not_enough_hints',
// //     });
// //   }

// //   await solveLevel(playerId, Number(l.n));

// //   res.json({
// //     correct: true,
// //     message: 'Skipped!',
// //     next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
// //     finished: Number(l.n) === TOTAL,
// //   });
// // }));

// // module.exports = r;
// const express = require('express');
// const db = require('../db');

// const r = express.Router();

// // total levels = highest level number found in bt_levels (updated on every request)
// let TOTAL = 7;

// const COST = {
//   hint: 25,
//   skip: 50,
// };

// const REWARD = {
//   video: 75,
//   gift: 25,
// };

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist API Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) {
//       res.status(500).json({
//         error: 'server_error',
//         message: err.message,
//       });
//     }
//   }
// };

// // MySQL query helper: expects mysql2/promise
// const one = async (sql, params = []) => {
//   const [rows] = await db.query(sql, params);
//   return rows[0] || null;
// };

// const parseJSON = (value) => {
//   while (typeof value === 'string') {
//     try {
//       value = JSON.parse(value);
//     } catch {
//       break;
//     }
//   }
//   return value;
// };

// const playerResponse = (p) => {
//   if (!p) return null;

//   const currentLevel = Math.max(
//     1,
//     Number(p.current_level) || 1
//   );

//   return {
//     id: p.id,
//     hints: Number(p.hints) || 0,
//     currentLevel: Math.min(currentLevel, TOTAL),
//     finished: currentLevel > TOTAL,
//     total: TOTAL,
//   };
// };

// const getLevel = async (n) => {
//   const levelNumber = Number(n);

//   if (
//     !Number.isInteger(levelNumber) ||
//     levelNumber < 1 ||
//     levelNumber > TOTAL
//   ) {
//     return null;
//   }

//   const l = await one(
//     'SELECT * FROM bt_levels WHERE n = ?',
//     [levelNumber]
//   );

//   if (!l) return null;

//   l.config = parseJSON(l.config);
//   l.answer = parseJSON(l.answer);

//   return l;
// };

// const spendHints = async (playerId, amount) => {
//   const [result] = await db.query(
//     `UPDATE bt_players
//      SET hints = hints - ?
//      WHERE id = ? AND hints >= ?`,
//     [amount, playerId, amount]
//   );

//   return result.affectedRows > 0;
// };

// const solveLevel = async (playerId, levelNumber) => {
//   await db.query(
//     `INSERT INTO bt_progress
//       (player_id, level_n, attempts, solved_at)
//      VALUES (?, ?, 0, NOW())
//      ON DUPLICATE KEY UPDATE solved_at = NOW()`,
//     [playerId, levelNumber]
//   );

//   await db.query(
//     `UPDATE bt_players
//      SET current_level = GREATEST(
//        COALESCE(current_level, 1), ?
//      )
//      WHERE id = ?`,
//     [levelNumber + 1, playerId]
//   );
// };

// const validPlayer = async (playerId) => {
//   if (!Number.isInteger(Number(playerId)) || Number(playerId) < 1) {
//     return false;
//   }

//   return Boolean(
//     await one('SELECT id FROM bt_players WHERE id = ?', [
//       Number(playerId),
//     ])
//   );
// };

// const isCorrect = (l, answer) => {
//   if (!l || !l.answer) return false;

//   const expected = l.answer.v;

//   if (l.type === 'drag') {
//     return (
//       answer &&
//       Number(answer.from) === Number(expected.from) &&
//       Number(answer.to) === Number(expected.to)
//     );
//   }

//   if (l.type === 'taps') {
//     return Number(answer) >= Number(expected);
//   }

//   return Number(answer) === Number(expected);
// };

// // keep TOTAL in sync with the database
// r.use(async (req, res, next) => {
//   try {
//     const row = await one('SELECT MAX(n) AS m FROM bt_levels');
//     if (row && Number(row.m) > 0) TOTAL = Number(row.m);
//   } catch (err) {
//     console.error('[BrainTwist] could not read total levels:', err.message);
//   }
//   next();
// });

// // Health check
// r.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     game: 'Brain Twist',
//     totalLevels: TOTAL,
//   });
// });

// // Create or retrieve guest player
// r.post('/players/guest', handle(async (req, res) => {
//   const deviceId = String(req.body?.deviceId || '').slice(0, 64);

//   if (!deviceId) {
//     return res.status(400).json({
//       error: 'deviceId_required',
//     });
//   }

//   await db.query(
//     'INSERT IGNORE INTO bt_players (device_id) VALUES (?)',
//     [deviceId]
//   );

//   const player = await one(
//     'SELECT * FROM bt_players WHERE device_id = ?',
//     [deviceId]
//   );

//   if (!player) {
//     return res.status(500).json({
//       error: 'player_creation_failed',
//     });
//   }

//   res.json(playerResponse(player));
// }));

// // Get player progress
// r.get('/players/:id', handle(async (req, res) => {
//   const player = await one(
//     'SELECT * FROM bt_players WHERE id = ?',
//     [req.params.id]
//   );

//   if (!player) {
//     return res.status(404).json({
//       error: 'no_player',
//     });
//   }

//   res.json(playerResponse(player));
// }));

// // Rewards
// r.post('/players/:id/reward', handle(async (req, res) => {
//   const rewardAmount = REWARD[req.body?.kind];

//   if (!rewardAmount) {
//     return res.status(400).json({
//       error: 'bad_kind',
//     });
//   }

//   const playerId = Number(req.params.id);

//   if (!(await validPlayer(playerId))) {
//     return res.status(404).json({
//       error: 'no_player',
//     });
//   }

//   await db.query(
//     'UPDATE bt_players SET hints = hints + ? WHERE id = ?',
//     [rewardAmount, playerId]
//   );

//   const player = await one(
//     'SELECT * FROM bt_players WHERE id = ?',
//     [playerId]
//   );

//   res.json(playerResponse(player));
// }));

// // Get level data. Never send the answer (or the hint text) to the frontend.
// r.get('/levels/:n', handle(async (req, res) => {
//   const l = await getLevel(req.params.n);

//   if (!l) {
//     return res.status(404).json({
//       error: 'no_level',
//       message: `Level ${req.params.n} was not found`,
//     });
//   }

//   const { hint: _hint, ...cfg } = l.config || {};

//   res.json({
//     n: Number(l.n),
//     type: l.type,
//     question: l.question,
//     total: TOTAL,
//     ...cfg,
//   });
// }));

// // Submit an answer
// r.post('/levels/:n/answer', handle(async (req, res) => {
//   const playerId = Number(req.body?.playerId);
//   const answer = req.body?.answer;
//   const l = await getLevel(req.params.n);

//   if (!l) {
//     return res.status(404).json({
//       error: 'no_level',
//     });
//   }

//   if (!(await validPlayer(playerId))) {
//     return res.status(404).json({
//       error: 'no_player',
//     });
//   }

//   if (answer === undefined || answer === null) {
//     return res.status(400).json({
//       error: 'answer_required',
//     });
//   }

//   await db.query(
//     `INSERT INTO bt_progress
//       (player_id, level_n, attempts)
//      VALUES (?, ?, 1)
//      ON DUPLICATE KEY UPDATE attempts = attempts + 1`,
//     [playerId, l.n]
//   );

//   if (!isCorrect(l, answer)) {
//     return res.json({
//       correct: false,
//     });
//   }

//   await solveLevel(playerId, Number(l.n));

//   // res.json({
//   //   correct: true,
//   //   message: l.answer.msg || 'Correct!',
//   //   next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
//   //   finished: Number(l.n) === TOTAL,
//   // });
//   res.json({
//   correct: true,
//   message: l.answer.msg || 'Correct!',
//   result: l.answer.result ?? null,
//   next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
//   finished: Number(l.n) === TOTAL,
// });
// }));

// // Use a hint
// r.post('/levels/:n/hint', handle(async (req, res) => {
//   const playerId = Number(req.body?.playerId);
//   const used = Array.isArray(req.body?.used)
//     ? req.body.used.map(Number)
//     : [];

//   const l = await getLevel(req.params.n);

//   if (!l) {
//     return res.status(404).json({
//       error: 'no_level',
//     });
//   }

//   if (!(await validPlayer(playerId))) {
//     return res.status(404).json({
//       error: 'no_player',
//     });
//   }

//   if (!(await spendHints(playerId, COST.hint))) {
//     return res.status(402).json({
//       error: 'not_enough_hints',
//     });
//   }

//   let hint;
//   const options = l.config?.options;

//   if (l.type === 'choice' && Array.isArray(options)) {
//     // number options (pizza count, racer position...): remove one wrong number
//     const correct = Number(l.answer.v);

//     const removable = options
//       .map(Number)
//       .filter((o) => o !== correct && !used.includes(o));

//     hint = removable.length
//       ? { removeOption: removable[0] }
//       : { text: l.config?.hint || 'Think about it once more!' };
//   } else if (l.type === 'choice' && !l.config?.input) {
//     // tap-an-item levels: fade one wrong item
//     const items = l.config?.items || [];
//     const correctIndex = Number(l.answer.v);

//     const removable = items
//       .map((_, index) => index)
//       .filter(
//         (index) =>
//           index !== correctIndex && !used.includes(index)
//       );

//     hint = removable.length
//       ? { remove: removable[0] }
//       : { text: l.config?.hint || 'Think about it once more!' };
//   } else {
//     hint = {
//       text: l.config?.hint || 'Look closely at what you can touch!',
//     };
//   }

//   const player = await one(
//     'SELECT hints FROM bt_players WHERE id = ?',
//     [playerId]
//   );

//   res.json({
//     hint,
//     hints: Number(player?.hints) || 0,
//   });
// }));

// // Skip a level
// r.post('/levels/:n/skip', handle(async (req, res) => {
//   const playerId = Number(req.body?.playerId);
//   const l = await getLevel(req.params.n);

//   if (!l) {
//     return res.status(404).json({
//       error: 'no_level',
//     });
//   }

//   if (!(await validPlayer(playerId))) {
//     return res.status(404).json({
//       error: 'no_player',
//     });
//   }

//   if (!(await spendHints(playerId, COST.skip))) {
//     return res.status(402).json({
//       error: 'not_enough_hints',
//     });
//   }

//   await solveLevel(playerId, Number(l.n));

//   res.json({
//     correct: true,
//     message: 'Skipped!',
//     next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
//     finished: Number(l.n) === TOTAL,
//   });
// }));

// r.use('/', require('./braintwistProgressRoutes'));
// module.exports = r;
const express = require('express');
const db = require('../db');

const r = express.Router();

// total levels = highest level number found in bt_levels (updated on every request)
let TOTAL = 7;

const COST = {
  hint: 25,
  skip: 50,
};

const REWARD = {
  video: 75,
  gift: 25,
};

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist API Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'server_error',
        message: err.message,
      });
    }
  }
};

// MySQL query helper: expects mysql2/promise
const one = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
};

const parseJSON = (value) => {
  while (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      break;
    }
  }
  return value;
};

const playerResponse = (p) => {
  if (!p) return null;

  const currentLevel = Math.max(1, Number(p.current_level) || 1);

  return {
    id: p.id,
    hints: Number(p.hints) || 0,
    currentLevel: Math.min(currentLevel, TOTAL),
    finished: currentLevel > TOTAL,
    total: TOTAL,
  };
};

const getLevel = async (n) => {
  const levelNumber = Number(n);

  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > TOTAL) {
    return null;
  }

  const l = await one('SELECT * FROM bt_levels WHERE n = ?', [levelNumber]);

  if (!l) return null;

  l.config = parseJSON(l.config);
  l.answer = parseJSON(l.answer);

  return l;
};

const spendHints = async (playerId, amount) => {
  const [result] = await db.query(
    `UPDATE bt_players
     SET hints = hints - ?
     WHERE id = ? AND hints >= ?`,
    [amount, playerId, amount]
  );

  return result.affectedRows > 0;
};

const solveLevel = async (playerId, levelNumber) => {
  await db.query(
    `INSERT INTO bt_progress
      (player_id, level_n, attempts, solved_at)
     VALUES (?, ?, 0, NOW())
     ON DUPLICATE KEY UPDATE solved_at = COALESCE(solved_at, NOW())`,
    [playerId, levelNumber]
  );

  await db.query(
    `UPDATE bt_players
     SET current_level = GREATEST(COALESCE(current_level, 1), ?)
     WHERE id = ?`,
    [levelNumber + 1, playerId]
  );
};

const validPlayer = async (playerId) => {
  if (!Number.isInteger(Number(playerId)) || Number(playerId) < 1) {
    return false;
  }

  return Boolean(
    await one('SELECT id FROM bt_players WHERE id = ?', [Number(playerId)])
  );
};

// single source of truth: first level that is not solved yet (bt_progress)
const firstUnsolved = async (playerId) => {
  const [rows] = await db.query(
    'SELECT level_n FROM bt_progress WHERE player_id = ? AND solved_at IS NOT NULL',
    [playerId]
  );
  const done = new Set(rows.map((x) => Number(x.level_n)));
  for (let n = 1; n <= TOTAL; n++) {
    if (!done.has(n)) return n;
  }
  return TOTAL + 1; // ellaa level um mudinjiruchu
};

const isCorrect = (l, answer) => {
  if (!l || !l.answer) return false;

  const expected = l.answer.v;

  if (l.type === 'drag') {
    return (
      answer &&
      Number(answer.from) === Number(expected.from) &&
      Number(answer.to) === Number(expected.to)
    );
  }

  if (l.type === 'taps') {
    return Number(answer) >= Number(expected);
  }

  return Number(answer) === Number(expected);
};

// keep TOTAL in sync with the database
r.use(async (req, res, next) => {
  try {
    const row = await one('SELECT MAX(n) AS m FROM bt_levels');
    if (row && Number(row.m) > 0) TOTAL = Number(row.m);
  } catch (err) {
    console.error('[BrainTwist] could not read total levels:', err.message);
  }
  next();
});

// Health check
r.get('/health', (req, res) => {
  res.json({
    success: true,
    game: 'Brain Twist',
    totalLevels: TOTAL,
  });
});

// Create or retrieve guest player
r.post('/players/guest', handle(async (req, res) => {
  const deviceId = String(req.body?.deviceId || '').slice(0, 64);

  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId_required' });
  }

  await db.query('INSERT IGNORE INTO bt_players (device_id) VALUES (?)', [deviceId]);

  const player = await one('SELECT * FROM bt_players WHERE device_id = ?', [deviceId]);

  if (!player) {
    return res.status(500).json({ error: 'player_creation_failed' });
  }

  player.current_level = await firstUnsolved(player.id);
  res.json(playerResponse(player));
}));

// Get player progress
r.get('/players/:id', handle(async (req, res) => {
  const player = await one('SELECT * FROM bt_players WHERE id = ?', [req.params.id]);

  if (!player) {
    return res.status(404).json({ error: 'no_player' });
  }

  player.current_level = await firstUnsolved(player.id);
  res.json(playerResponse(player));
}));

// Rewards
r.post('/players/:id/reward', handle(async (req, res) => {
  const rewardAmount = REWARD[req.body?.kind];

  if (!rewardAmount) {
    return res.status(400).json({ error: 'bad_kind' });
  }

  const playerId = Number(req.params.id);

  if (!(await validPlayer(playerId))) {
    return res.status(404).json({ error: 'no_player' });
  }

  await db.query('UPDATE bt_players SET hints = hints + ? WHERE id = ?', [rewardAmount, playerId]);

  const player = await one('SELECT * FROM bt_players WHERE id = ?', [playerId]);

  res.json(playerResponse(player));
}));

// Get level data. Never send the answer (or the hint text) to the frontend.
r.get('/levels/:n', handle(async (req, res) => {
  const l = await getLevel(req.params.n);

  if (!l) {
    return res.status(404).json({
      error: 'no_level',
      message: `Level ${req.params.n} was not found`,
    });
  }

  const { hint: _hint, ...cfg } = l.config || {};

  res.json({
    n: Number(l.n),
    type: l.type,
    question: l.question,
    total: TOTAL,
    ...cfg,
  });
}));

// Submit an answer
r.post('/levels/:n/answer', handle(async (req, res) => {
  const playerId = Number(req.body?.playerId);
  const answer = req.body?.answer;
  const l = await getLevel(req.params.n);

  if (!l) {
    return res.status(404).json({ error: 'no_level' });
  }

  if (!(await validPlayer(playerId))) {
    return res.status(404).json({ error: 'no_player' });
  }

  if (answer === undefined || answer === null) {
    return res.status(400).json({ error: 'answer_required' });
  }

  await db.query(
    `INSERT INTO bt_progress
      (player_id, level_n, attempts)
     VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE attempts = attempts + 1`,
    [playerId, l.n]
  );

  if (!isCorrect(l, answer)) {
    return res.json({ correct: false });
  }

  await solveLevel(playerId, Number(l.n));

  res.json({
    correct: true,
    message: l.answer.msg || 'Correct!',
    result: l.answer.result ?? null,
    next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
    finished: Number(l.n) === TOTAL,
  });
}));

// Use a hint
r.post('/levels/:n/hint', handle(async (req, res) => {
  const playerId = Number(req.body?.playerId);
  const used = Array.isArray(req.body?.used) ? req.body.used.map(Number) : [];

  const l = await getLevel(req.params.n);

  if (!l) {
    return res.status(404).json({ error: 'no_level' });
  }

  if (!(await validPlayer(playerId))) {
    return res.status(404).json({ error: 'no_player' });
  }

  if (!(await spendHints(playerId, COST.hint))) {
    return res.status(402).json({ error: 'not_enough_hints' });
  }

  let hint;
  const options = l.config?.options;

  if (l.type === 'choice' && Array.isArray(options)) {
    // number options (pizza count, racer position...): remove one wrong number
    const correct = Number(l.answer.v);

    const removable = options
      .map(Number)
      .filter((o) => o !== correct && !used.includes(o));

    hint = removable.length
      ? { removeOption: removable[0] }
      : { text: l.config?.hint || 'Think about it once more!' };
  } else if (l.type === 'choice' && !l.config?.input) {
    // tap-an-item levels: fade one wrong item
    const items = l.config?.items || [];
    const correctIndex = Number(l.answer.v);

    const removable = items
      .map((_, index) => index)
      .filter((index) => index !== correctIndex && !used.includes(index));

    hint = removable.length
      ? { remove: removable[0] }
      : { text: l.config?.hint || 'Think about it once more!' };
  } else {
    hint = {
      text: l.config?.hint || 'Look closely at what you can touch!',
    };
  }

  const player = await one('SELECT hints FROM bt_players WHERE id = ?', [playerId]);

  res.json({
    hint,
    hints: Number(player?.hints) || 0,
  });
}));

// Skip a level
r.post('/levels/:n/skip', handle(async (req, res) => {
  const playerId = Number(req.body?.playerId);
  const l = await getLevel(req.params.n);

  if (!l) {
    return res.status(404).json({ error: 'no_level' });
  }

  if (!(await validPlayer(playerId))) {
    return res.status(404).json({ error: 'no_player' });
  }

  if (!(await spendHints(playerId, COST.skip))) {
    return res.status(402).json({ error: 'not_enough_hints' });
  }

  await solveLevel(playerId, Number(l.n));

  res.json({
    correct: true,
    message: 'Skipped!',
    next: Number(l.n) < TOTAL ? Number(l.n) + 1 : null,
    finished: Number(l.n) === TOTAL,
  });
}));

r.use('/', require('./braintwistProgressRoutes'));
module.exports = r;