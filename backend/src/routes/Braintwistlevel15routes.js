// // // // const express = require('express');
// // // // const l15 = require('../data/level15Db');

// // // // const r = express.Router();

// // // // const HINT_COST = 25;
// // // // const SKIP_COST = 50;
// // // // const REWARD_HINTS = 75;

// // // // /* ---------- WHAT THE PLAYER CAN TAP (decoys) ---------- */

// // // // const TAP_MESSAGES = {
// // // //   books: 'Just some books. Nothing inside.',
// // // //   desk: 'An ordinary desk.',
// // // //   window: 'Nice view, but no code here.',
// // // //   picture: 'A sunny picture.',
// // // //   plant: 'A happy plant.',
// // // //   shelf: 'Only books on the shelf.',
// // // // };

// // // // /* ---------- HELPERS ---------- */

// // // // const handle = (fn) => async (req, res) => {
// // // //   try {
// // // //     await fn(req, res);
// // // //   } catch (err) {
// // // //     console.error('[BrainTwist L15 Error]', req.method, req.originalUrl, err);
// // // //     if (!res.headersSent) {
// // // //       res.status(500).json({ success: false, error: 'server_error', message: err.message });
// // // //     }
// // // //   }
// // // // };

// // // // const toId = (value) => {
// // // //   const n = Number(value);
// // // //   return Number.isInteger(n) && n > 0 ? n : null;
// // // // };

// // // // const bad = (res, status, error, message) =>
// // // //   res.status(status).json({ success: false, error, message });

// // // // // what the frontend may see. The code is sent ONLY after the vault was moved.
// // // // const sessionView = (session, hints) => ({
// // // //   success: true,
// // // //   sessionId: session.id,
// // // //   level: l15.LEVEL,
// // // //   status: session.status,
// // // //   vaultMoved: Boolean(session.vault_moved),
// // // //   code: session.vault_moved ? session.code : null,
// // // //   codeLength: l15.CODE_LENGTH,
// // // //   wrongAttempts: Number(session.wrong_attempts),
// // // //   hints,
// // // // });

// // // // // reads ids from body, loads the session, answers the error itself when something is wrong
// // // // const loadSession = async (req, res, { allowFinished = false } = {}) => {
// // // //   const sessionId = toId(req.body?.sessionId);
// // // //   const playerId = toId(req.body?.playerId);

// // // //   if (!sessionId || !playerId) {
// // // //     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// // // //     return null;
// // // //   }

// // // //   const session = await l15.getSession(sessionId, playerId);
// // // //   if (!session) {
// // // //     bad(res, 404, 'no_session', 'Session not found');
// // // //     return null;
// // // //   }

// // // //   if (!allowFinished && session.status !== 'in_progress') {
// // // //     bad(res, 409, 'already_finished', 'This level is already finished');
// // // //     return null;
// // // //   }

// // // //   return { session, playerId };
// // // // };

// // // // r.use(async (req, res, next) => {
// // // //   await l15.ready;
// // // //   next();
// // // // });

// // // // /* ---------------------------------------------------------
// // // //    POST /level15/start     body: { playerId }
// // // // --------------------------------------------------------- */

// // // // r.post('/start', handle(async (req, res) => {
// // // //   const playerId = toId(req.body?.playerId);
// // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // // //   const player = await l15.getPlayer(playerId);
// // // //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// // // //   // continue an unfinished game, otherwise start a new one with a new password
// // // //   let session = await l15.getActiveSession(playerId);
// // // //   if (!session) session = await l15.createSession(playerId);

// // // //   res.json({
// // // //     ...sessionView(session, Number(player.hints) || 0),
// // // //     title: 'We must open this vault.',
// // // //   });
// // // // }));

// // // // /* ---------------------------------------------------------
// // // //    POST /level15/move      body: { sessionId, playerId }
// // // //    the player pushed the vault aside -> the paper behind it is shown
// // // // --------------------------------------------------------- */

// // // // r.post('/move', handle(async (req, res) => {
// // // //   const ctx = await loadSession(req, res);
// // // //   if (!ctx) return;
// // // //   const { session, playerId } = ctx;

// // // //   if (!session.vault_moved) {
// // // //     await l15.markVaultMoved(session.id);
// // // //     await l15.recordAction(session.id, 'move', 'vault', true);
// // // //     session.vault_moved = 1;
// // // //   }

// // // //   res.json({
// // // //     ...sessionView(session, await l15.getHints(playerId)),
// // // //     message: 'A paper was hidden behind the vault!',
// // // //   });
// // // // }));

// // // // /* ---------------------------------------------------------
// // // //    POST /level15/tap       body: { sessionId, playerId, target }
// // // //    wrong places (books, desk ...) are saved too
// // // // --------------------------------------------------------- */

// // // // r.post('/tap', handle(async (req, res) => {
// // // //   const ctx = await loadSession(req, res);
// // // //   if (!ctx) return;
// // // //   const { session } = ctx;

// // // //   const target = String(req.body?.target || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 20);
// // // //   if (!TAP_MESSAGES[target]) return bad(res, 400, 'bad_target', 'Unknown target');

// // // //   await l15.recordAction(session.id, 'tap', target, false);
// // // //   await l15.addTap(session.id);

// // // //   res.json({ success: true, correct: false, message: TAP_MESSAGES[target] });
// // // // }));

// // // // /* ---------------------------------------------------------
// // // //    POST /level15/enter     body: { sessionId, playerId, code }
// // // // --------------------------------------------------------- */

// // // // r.post('/enter', handle(async (req, res) => {
// // // //   const ctx = await loadSession(req, res);
// // // //   if (!ctx) return;
// // // //   const { session, playerId } = ctx;

// // // //   const code = String(req.body?.code || '').replace(/[^0-9]/g, '').slice(0, 8);
// // // //   if (code.length !== l15.CODE_LENGTH) {
// // // //     return bad(res, 400, 'invalid_code', `Code must have ${l15.CODE_LENGTH} digits`);
// // // //   }

// // // //   const wrongBefore = Number(session.wrong_attempts);
// // // //   const attemptsBefore = Number(session.total_attempts);
// // // //   const correct = code === session.code;

// // // //   await l15.recordAction(session.id, 'code', code, correct);
// // // //   await l15.addAttempt(session.id, !correct);

// // // //   if (!correct) {
// // // //     return res.json({
// // // //       success: true,
// // // //       correct: false,
// // // //       completed: false,
// // // //       wrongAttempts: wrongBefore + 1,
// // // //       message: session.vault_moved
// // // //         ? 'Wrong code. Check the paper again.'
// // // //         : 'Wrong code. Look around, the code is hidden somewhere.',
// // // //     });
// // // //   }

// // // //   // correct -> score, stars, save progress, unlock level 16
// // // //   const attempts = attemptsBefore + 1;
// // // //   const score = Math.max(100, 300 - wrongBefore * 50);
// // // //   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

// // // //   await l15.completeSession(session.id, Number(session.elapsed) || 0);

// // // //   let progressSaved = false;
// // // //   try {
// // // //     await l15.saveProgress(playerId, score, stars, attempts);
// // // //     progressSaved = true;
// // // //   } catch (err) {
// // // //     console.error('[BrainTwist L15] could not save progress:', err.message);
// // // //   }

// // // //   try {
// // // //     await l15.unlockNext(playerId, attempts);
// // // //   } catch (err) {
// // // //     console.error('[BrainTwist L15] could not unlock next level:', err.message);
// // // //   }

// // // //   res.json({
// // // //     success: true,
// // // //     correct: true,
// // // //     completed: true,
// // // //     message: 'The vault is open!',
// // // //     score,
// // // //     stars,
// // // //     attempts,
// // // //     seconds: Number(session.elapsed) || 0,
// // // //     progressSaved,
// // // //   });
// // // // }));

// // // // /* ---------------------------------------------------------
// // // //    POST /level15/hint      body: { sessionId, playerId }     costs 25 hints
// // // // --------------------------------------------------------- */

// // // // r.post('/hint', handle(async (req, res) => {
// // // //   const ctx = await loadSession(req, res);
// // // //   if (!ctx) return;
// // // //   const { session, playerId } = ctx;

// // // //   const left = await l15.spendHints(playerId, HINT_COST);
// // // //   if (left === null) {
// // // //     return bad(res, 402, 'not_enough_hints', `You need ${HINT_COST} hints`);
// // // //   }

// // // //   await l15.markHintUsed(session.id);
// // // //   await l15.recordAction(session.id, 'hint', '', false);

// // // //   res.json({
// // // //     success: true,
// // // //     hints: left,
// // // //     message: session.vault_moved
// // // //       ? 'Type the numbers from the paper on the keypad.'
// // // //       : 'Something is hidden behind the vault. Try to move it.',
// // // //   });
// // // // }));

// // // // /* ---------------------------------------------------------
// // // //    POST /level15/skip      body: { sessionId, playerId }     costs 50 hints
// // // // --------------------------------------------------------- */

// // // // r.post('/skip', handle(async (req, res) => {
// // // //   const ctx = await loadSession(req, res);
// // // //   if (!ctx) return;
// // // //   const { session, playerId } = ctx;

// // // //   const left = await l15.spendHints(playerId, SKIP_COST);
// // // //   if (left === null) {
// // // //     return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
// // // //   }

// // // //   await l15.skipSession(session.id, Number(session.elapsed) || 0);
// // // //   await l15.recordAction(session.id, 'skip', '', false);
// // // //   await l15.unlockNext(playerId, Number(session.total_attempts) || 0);

// // // //   res.json({ success: true, skipped: true, hints: left, message: 'Level skipped' });
// // // // }));

// // // // /* ---------------------------------------------------------
// // // //    POST /level15/reward    body: { playerId }      video reward +75 hints
// // // // --------------------------------------------------------- */

// // // // r.post('/reward', handle(async (req, res) => {
// // // //   const playerId = toId(req.body?.playerId);
// // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // // //   const hints = await l15.addHints(playerId, REWARD_HINTS);
// // // //   res.json({ success: true, hints, added: REWARD_HINTS });
// // // // }));

// // // // /* ---------------------------------------------------------
// // // //    GET /level15/status/:playerId
// // // // --------------------------------------------------------- */

// // // // r.get('/status/:playerId', handle(async (req, res) => {
// // // //   const playerId = toId(req.params.playerId);
// // // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // // //   const row = await l15.getProgress(playerId);

// // // //   res.json({
// // // //     success: true,
// // // //     level: l15.LEVEL,
// // // //     completed: Boolean(row && row.is_completed),
// // // //     score: row ? Number(row.score) || 0 : 0,
// // // //     stars: row ? Number(row.stars) || 0 : 0,
// // // //     attempts: row ? Number(row.attempts) || 0 : 0,
// // // //     completedAt: row ? row.completed_at : null,
// // // //   });
// // // // }));

// // // // module.exports = r;
// // // const express = require('express');
// // // const l15 = require('../data/level15Db');

// // // const r = express.Router();

// // // const HINT_COST = 25;
// // // const SKIP_COST = 50;
// // // const REWARD_HINTS = 75;

// // // /* ---------- WHAT THE PLAYER CAN TAP (decoys) ---------- */

// // // const TAP_MESSAGES = {
// // //   books: 'Just some books. Nothing inside.',
// // //   desk: 'An ordinary desk.',
// // //   window: 'Nice view, but no code here.',
// // //   picture: 'A sunny picture.',
// // //   plant: 'A happy plant.',
// // //   shelf: 'Only books on the shelf.',
// // // };

// // // /* ---------- HELPERS ---------- */

// // // const handle = (fn) => async (req, res) => {
// // //   try {
// // //     await fn(req, res);
// // //   } catch (err) {
// // //     console.error('[BrainTwist L15 Error]', req.method, req.originalUrl, err);
// // //     if (!res.headersSent) {
// // //       res.status(500).json({ success: false, error: 'server_error', message: err.message });
// // //     }
// // //   }
// // // };

// // // const toId = (value) => {
// // //   const n = Number(value);
// // //   return Number.isInteger(n) && n > 0 ? n : null;
// // // };

// // // const bad = (res, status, error, message) =>
// // //   res.status(status).json({ success: false, error, message });

// // // // what the frontend may see. The code is sent ONLY after the vault was moved.
// // // const sessionView = (session, hints) => ({
// // //   success: true,
// // //   sessionId: session.id,
// // //   level: l15.LEVEL,
// // //   status: session.status,
// // //   vaultMoved: Boolean(session.vault_moved),
// // //   code: session.vault_moved ? session.code : null,
// // //   codeLength: l15.CODE_LENGTH,
// // //   wrongAttempts: Number(session.wrong_attempts),
// // //   hints,
// // // });

// // // // reads ids from body, loads the session, answers the error itself when something is wrong
// // // const loadSession = async (req, res, { allowFinished = false } = {}) => {
// // //   const sessionId = toId(req.body?.sessionId);
// // //   const playerId = toId(req.body?.playerId);

// // //   if (!sessionId || !playerId) {
// // //     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
// // //     return null;
// // //   }

// // //   const session = await l15.getSession(sessionId, playerId);
// // //   if (!session) {
// // //     bad(res, 404, 'no_session', 'Session not found');
// // //     return null;
// // //   }

// // //   if (!allowFinished && session.status !== 'in_progress') {
// // //     bad(res, 409, 'already_finished', 'This level is already finished');
// // //     return null;
// // //   }

// // //   return { session, playerId };
// // // };

// // // r.use(async (req, res, next) => {
// // //   await l15.ready;
// // //   next();
// // // });

// // // /* ---------------------------------------------------------
// // //    POST /level15/start     body: { playerId }
// // // --------------------------------------------------------- */

// // // r.post('/start', handle(async (req, res) => {
// // //   const playerId = toId(req.body?.playerId);
// // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // //   const player = await l15.getPlayer(playerId);
// // //   if (!player) return bad(res, 404, 'no_player', 'Player not found');

// // //   // continue an unfinished game, otherwise start a new one with a new password
// // //   let session = await l15.getActiveSession(playerId);

// // //   // an old unfinished game with a repeated-digit code is replaced (the dots need 4 different digits)
// // //   if (session && new Set(String(session.code).split('')).size !== String(session.code).length) {
// // //     await l15.abandonSession(session.id);
// // //     session = null;
// // //   }
// // //   if (!session) session = await l15.createSession(playerId);

// // //   res.json({
// // //     ...sessionView(session, Number(player.hints) || 0),
// // //     title: 'We must open this vault.',
// // //   });
// // // }));

// // // /* ---------------------------------------------------------
// // //    POST /level15/move      body: { sessionId, playerId }
// // //    the player pushed the vault aside -> the paper behind it is shown
// // // --------------------------------------------------------- */

// // // r.post('/move', handle(async (req, res) => {
// // //   const ctx = await loadSession(req, res);
// // //   if (!ctx) return;
// // //   const { session, playerId } = ctx;

// // //   if (!session.vault_moved) {
// // //     await l15.markVaultMoved(session.id);
// // //     await l15.recordAction(session.id, 'move', 'vault', true);
// // //     session.vault_moved = 1;
// // //   }

// // //   res.json({
// // //     ...sessionView(session, await l15.getHints(playerId)),
// // //     message: 'A paper was hidden behind the vault!',
// // //   });
// // // }));

// // // /* ---------------------------------------------------------
// // //    POST /level15/tap       body: { sessionId, playerId, target }
// // //    wrong places (books, desk ...) are saved too
// // // --------------------------------------------------------- */

// // // r.post('/tap', handle(async (req, res) => {
// // //   const ctx = await loadSession(req, res);
// // //   if (!ctx) return;
// // //   const { session } = ctx;

// // //   const target = String(req.body?.target || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 20);
// // //   if (!TAP_MESSAGES[target]) return bad(res, 400, 'bad_target', 'Unknown target');

// // //   await l15.recordAction(session.id, 'tap', target, false);
// // //   await l15.addTap(session.id);

// // //   res.json({ success: true, correct: false, message: TAP_MESSAGES[target] });
// // // }));

// // // /* ---------------------------------------------------------
// // //    POST /level15/enter     body: { sessionId, playerId, code }
// // // --------------------------------------------------------- */

// // // r.post('/enter', handle(async (req, res) => {
// // //   const ctx = await loadSession(req, res);
// // //   if (!ctx) return;
// // //   const { session, playerId } = ctx;

// // //   const code = String(req.body?.code || '').replace(/[^0-9]/g, '').slice(0, 8);
// // //   if (code.length !== l15.CODE_LENGTH) {
// // //     return bad(res, 400, 'invalid_code', `Code must have ${l15.CODE_LENGTH} digits`);
// // //   }

// // //   const wrongBefore = Number(session.wrong_attempts);
// // //   const attemptsBefore = Number(session.total_attempts);
// // //   const correct = code === session.code;

// // //   await l15.recordAction(session.id, 'code', code, correct);
// // //   await l15.addAttempt(session.id, !correct);

// // //   if (!correct) {
// // //     return res.json({
// // //       success: true,
// // //       correct: false,
// // //       completed: false,
// // //       wrongAttempts: wrongBefore + 1,
// // //       message: session.vault_moved
// // //         ? 'Wrong code. Check the paper again.'
// // //         : 'Wrong code. Look around, the code is hidden somewhere.',
// // //     });
// // //   }

// // //   // correct -> score, stars, save progress, unlock level 16
// // //   const attempts = attemptsBefore + 1;
// // //   const score = Math.max(100, 300 - wrongBefore * 50);
// // //   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

// // //   await l15.completeSession(session.id, Number(session.elapsed) || 0);

// // //   let progressSaved = false;
// // //   try {
// // //     await l15.saveProgress(playerId, score, stars, attempts);
// // //     progressSaved = true;
// // //   } catch (err) {
// // //     console.error('[BrainTwist L15] could not save progress:', err.message);
// // //   }

// // //   try {
// // //     await l15.unlockNext(playerId, attempts);
// // //   } catch (err) {
// // //     console.error('[BrainTwist L15] could not unlock next level:', err.message);
// // //   }

// // //   res.json({
// // //     success: true,
// // //     correct: true,
// // //     completed: true,
// // //     message: 'The vault is open!',
// // //     score,
// // //     stars,
// // //     attempts,
// // //     seconds: Number(session.elapsed) || 0,
// // //     progressSaved,
// // //   });
// // // }));

// // // /* ---------------------------------------------------------
// // //    POST /level15/hint      body: { sessionId, playerId }     costs 25 hints
// // // --------------------------------------------------------- */

// // // r.post('/hint', handle(async (req, res) => {
// // //   const ctx = await loadSession(req, res);
// // //   if (!ctx) return;
// // //   const { session, playerId } = ctx;

// // //   const left = await l15.spendHints(playerId, HINT_COST);
// // //   if (left === null) {
// // //     return bad(res, 402, 'not_enough_hints', `You need ${HINT_COST} hints`);
// // //   }

// // //   await l15.markHintUsed(session.id);
// // //   await l15.recordAction(session.id, 'hint', '', false);

// // //   res.json({
// // //     success: true,
// // //     hints: left,
// // //     message: session.vault_moved
// // //       ? 'Type the numbers from the paper on the keypad.'
// // //       : 'Something is hidden behind the vault. Try to move it.',
// // //   });
// // // }));

// // // /* ---------------------------------------------------------
// // //    POST /level15/skip      body: { sessionId, playerId }     costs 50 hints
// // // --------------------------------------------------------- */

// // // r.post('/skip', handle(async (req, res) => {
// // //   const ctx = await loadSession(req, res);
// // //   if (!ctx) return;
// // //   const { session, playerId } = ctx;

// // //   const left = await l15.spendHints(playerId, SKIP_COST);
// // //   if (left === null) {
// // //     return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
// // //   }

// // //   await l15.skipSession(session.id, Number(session.elapsed) || 0);
// // //   await l15.recordAction(session.id, 'skip', '', false);
// // //   await l15.unlockNext(playerId, Number(session.total_attempts) || 0);

// // //   res.json({ success: true, skipped: true, hints: left, message: 'Level skipped' });
// // // }));

// // // /* ---------------------------------------------------------
// // //    POST /level15/reward    body: { playerId }      video reward +75 hints
// // // --------------------------------------------------------- */

// // // r.post('/reward', handle(async (req, res) => {
// // //   const playerId = toId(req.body?.playerId);
// // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // //   const hints = await l15.addHints(playerId, REWARD_HINTS);
// // //   res.json({ success: true, hints, added: REWARD_HINTS });
// // // }));

// // // /* ---------------------------------------------------------
// // //    GET /level15/status/:playerId
// // // --------------------------------------------------------- */

// // // r.get('/status/:playerId', handle(async (req, res) => {
// // //   const playerId = toId(req.params.playerId);
// // //   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

// // //   const row = await l15.getProgress(playerId);

// // //   res.json({
// // //     success: true,
// // //     level: l15.LEVEL,
// // //     completed: Boolean(row && row.is_completed),
// // //     score: row ? Number(row.score) || 0 : 0,
// // //     stars: row ? Number(row.stars) || 0 : 0,
// // //     attempts: row ? Number(row.attempts) || 0 : 0,
// // //     completedAt: row ? row.completed_at : null,
// // //   });
// // // }));

// // // module.exports = r;
// // import React, { useEffect, useRef } from 'react';
// // import { View, Text, TouchableOpacity, Animated, PanResponder, StyleSheet, Easing } from 'react-native';
// // import Svg, { Rect, Circle, Line, Polygon, G, Text as SvgText } from 'react-native-svg';
// // import { F } from './BTShared';

// // /* =========================================================
// //    ROOM BACKGROUND - same cozy room as Level 1
// //    (window + plant, sun picture, bookshelf, books stack, rug, plant).
// //    NO draggable pencil / eraser and no dashed rings.
// // ========================================================= */

// // const yoyo = (v: Animated.Value, ms: number) =>
// //   Animated.loop(
// //     Animated.sequence([
// //       Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //       Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
// //     ])
// //   ).start();

// // const Mote = ({ left, size, ms, delay }: any) => {
// //   const p = useRef(new Animated.Value(0)).current;
// //   useEffect(() => {
// //     Animated.sequence([
// //       Animated.delay(delay),
// //       Animated.loop(Animated.timing(p, { toValue: 1, duration: ms, easing: Easing.linear, useNativeDriver: true })),
// //     ]).start();
// //   }, []);
// //   return (
// //     <Animated.View
// //       pointerEvents="none"
// //       style={{
// //         position: 'absolute', left, bottom: '18%', width: size, height: size, borderRadius: size / 2, backgroundColor: '#fff',
// //         opacity: p.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 0.8, 0.6, 0] }),
// //         transform: [
// //           { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, -420] }) },
// //           { translateX: p.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 14, -8] }) },
// //         ],
// //       }}
// //     />
// //   );
// // };

// // const Leaf = ({ l, b, w, h, r, c }: any) => (
// //   <View style={{ position: 'absolute', left: l, bottom: b, width: w, height: h, borderRadius: h / 2, backgroundColor: c || '#5fae3a', transform: [{ rotate: r + 'deg' }] }} />
// // );

// // export function RoomBg15() {
// //   const beam = useRef(new Animated.Value(0)).current,
// //     cl = useRef(new Animated.Value(0)).current,
// //     sw = useRef(new Animated.Value(0)).current,
// //     sw2 = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     yoyo(beam, 3600);
// //     yoyo(sw, 2400);
// //     yoyo(sw2, 3000);
// //     Animated.loop(Animated.timing(cl, { toValue: 1, duration: 26000, easing: Easing.linear, useNativeDriver: true })).start();
// //   }, []);

// //   const bo = beam.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
// //     bx = beam.interpolate({ inputRange: [0, 1], outputRange: [-14, 14] }),
// //     cx = cl.interpolate({ inputRange: [0, 1], outputRange: [-50, 90] }),
// //     plantR = sw.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] }),
// //     plantR2 = sw2.interpolate({ inputRange: [0, 1], outputRange: ['2.5deg', '-2.5deg'] });

// //   const books = (arr: any[]) =>
// //     arr.map((b, i) => <View key={i} style={{ width: b[0], height: b[1], backgroundColor: b[2], borderRadius: 2, marginRight: 1 }} />);

// //   return (
// //     <View pointerEvents="none" style={StyleSheet.absoluteFill}>
// //       {/* wall */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '45%', backgroundColor: 'rgba(255,255,255,0.22)' }} />
// //       <View style={{ position: 'absolute', left: 0, right: 0, top: '45%', height: '30%', backgroundColor: 'rgba(255,255,255,0.08)' }} />

// //       {/* picture frame */}
// //       <View style={{ position: 'absolute', right: '7%', top: '11%', width: 66, height: 74, backgroundColor: '#cfe6f3', borderWidth: 4, borderColor: '#8fc3d8' }}>
// //         <View style={{ alignSelf: 'center', marginTop: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#f6a43c', borderWidth: 4, borderColor: '#f7c36a' }} />
// //       </View>

// //       {/* window */}
// //       <View style={{ position: 'absolute', left: -4, top: '8%', width: 82, height: 200, backgroundColor: '#f0b878', borderWidth: 5, borderColor: '#e2a35e', borderRadius: 4, overflow: 'hidden' }}>
// //         <View style={{ flex: 1, backgroundColor: '#8fd3f6', overflow: 'hidden' }}>
// //           <Animated.View style={{ position: 'absolute', top: 24, transform: [{ translateX: cx }] }}>
// //             <View style={{ width: 50, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)' }} />
// //             <View style={{ position: 'absolute', left: 10, top: -9, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.9)' }} />
// //           </Animated.View>
// //           <Animated.View style={{ position: 'absolute', top: 76, transform: [{ translateX: cx.interpolate({ inputRange: [-50, 90], outputRange: [60, -60] }) }] }}>
// //             <View style={{ width: 36, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.75)' }} />
// //           </Animated.View>
// //           <View style={{ position: 'absolute', left: 6, bottom: -14, width: 44, height: 60, borderRadius: 30, backgroundColor: '#7bc65a' }} />
// //           <View style={{ position: 'absolute', left: 36, bottom: -20, width: 50, height: 70, borderRadius: 35, backgroundColor: '#62b24a' }} />
// //         </View>
// //         <View style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 4, backgroundColor: '#e2a35e' }} />
// //       </View>

// //       {/* window sill + plant */}
// //       <View style={{ position: 'absolute', left: 0, top: '8%', marginTop: 196, width: 96, height: 14, backgroundColor: '#e9b370', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
// //       <Animated.View style={{ position: 'absolute', left: 10, top: '8%', marginTop: 132, width: 70, height: 66, transform: [{ rotate: plantR }] }}>
// //         <Leaf l={6} b={24} w={20} h={50} r={-28} />
// //         <Leaf l={22} b={24} w={22} h={60} r={-4} c="#4f9f34" />
// //         <Leaf l={40} b={24} w={20} h={48} r={26} />
// //         <View style={{ position: 'absolute', left: 14, bottom: 0, width: 40, height: 28, borderRadius: 8, backgroundColor: '#f5ead8' }}>
// //           <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 9 }}>
// //             <View style={eye.e} />
// //             <View style={eye.e} />
// //           </View>
// //         </View>
// //       </Animated.View>

// //       {/* sunbeams */}
// //       <Animated.View style={{ position: 'absolute', top: '-6%', left: '14%', width: 96, height: '82%', backgroundColor: 'rgba(255,255,255,0.16)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
// //       <Animated.View style={{ position: 'absolute', top: '-6%', left: '34%', width: 64, height: '80%', backgroundColor: 'rgba(255,255,255,0.12)', opacity: bo.interpolate({ inputRange: [0.45, 1], outputRange: [1, 0.5] }), transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />
// //       <Animated.View style={{ position: 'absolute', top: '-6%', left: '54%', width: 110, height: '78%', backgroundColor: 'rgba(255,255,255,0.10)', opacity: bo, transform: [{ translateX: bx }, { rotate: '-17deg' }] }} />

// //       {/* bookshelf (right) */}
// //       <View style={{ position: 'absolute', right: 0, top: '38%', width: 70, height: '31%', backgroundColor: '#e0a85e', borderLeftWidth: 5, borderTopWidth: 5, borderColor: '#c98d4d' }}>
// //         <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
// //           {books([[12, 46, '#58a6c8'], [10, 52, '#f2c14e'], [12, 44, '#7b6bd0']])}
// //         </View>
// //         <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 8, borderBottomWidth: 5, borderColor: '#c98d4d' }}>
// //           {books([[12, 40, '#3f7fc4'], [10, 46, '#59b3a0']])}
// //         </View>
// //         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
// //           <View style={{ width: 44, height: 34, borderRadius: 16, backgroundColor: '#b9763a' }} />
// //           <View style={{ position: 'absolute', top: 6, left: 10, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
// //           <View style={{ position: 'absolute', top: 6, right: 14, width: 14, height: 14, borderRadius: 7, backgroundColor: '#b9763a' }} />
// //           <View style={{ position: 'absolute', top: 20, width: 20, height: 14, borderRadius: 8, backgroundColor: '#f0cfa0' }} />
// //         </View>
// //       </View>

// //       {/* hanging vine on shelf */}
// //       <Animated.View style={{ position: 'absolute', right: 2, top: '30%', width: 50, height: 80, transform: [{ rotate: plantR2 }] }}>
// //         <Leaf l={6} b={8} w={14} h={30} r={-20} />
// //         <Leaf l={22} b={20} w={14} h={32} r={18} c="#4f9f34" />
// //         <Leaf l={10} b={42} w={14} h={30} r={-10} />
// //       </Animated.View>

// //       {/* floor + rug */}
// //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '31%', backgroundColor: '#e9b575' }}>
// //         {[18, 46, 78, 112, 150].map((t, i) => (
// //           <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: t, height: 1.5, backgroundColor: 'rgba(150,90,40,0.18)' }} />
// //         ))}
// //         <View style={{ position: 'absolute', left: '4%', top: '12%', width: '92%', height: 140, borderRadius: 80, backgroundColor: '#f6e8cc', borderWidth: 10, borderColor: 'rgba(143,190,235,0.55)' }} />
// //       </View>
// //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: '31%', height: 14, backgroundColor: '#e8b8b0' }} />

// //       {/* books stack + toy car (left) */}
// //       <View style={{ position: 'absolute', left: -6, bottom: '27%' }}>
// //         <View style={{ width: 84, height: 16, borderRadius: 3, backgroundColor: '#3f9ad6', marginBottom: 1 }} />
// //         <View style={{ width: 92, height: 16, borderRadius: 3, backgroundColor: '#e86fae', marginBottom: 1, marginLeft: -4 }} />
// //         <View style={{ width: 88, height: 16, borderRadius: 3, backgroundColor: '#f2c14e', marginBottom: 1 }} />
// //         <View style={{ width: 80, height: 14, borderRadius: 3, backgroundColor: '#4b7fc4' }} />
// //       </View>
// //       <View style={{ position: 'absolute', left: 6, bottom: '25%', width: 54, height: 24, borderRadius: 10, backgroundColor: '#3aa0e0' }}>
// //         <View style={{ position: 'absolute', left: 14, top: -10, width: 24, height: 14, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#7cc7f0' }} />
// //         <View style={{ position: 'absolute', left: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
// //         <View style={{ position: 'absolute', right: 6, bottom: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2d4a6b' }} />
// //       </View>

// //       {/* pencil cup (right) - part of the room, same as Level 1 */}
// //       <View style={{ position: 'absolute', right: 6, bottom: '24%', width: 44, height: 58, borderRadius: 6, backgroundColor: '#f5c63a', borderWidth: 2, borderColor: '#e0a81f' }} />
// //       <View style={{ position: 'absolute', right: 22, bottom: '24%', marginBottom: 54, width: 6, height: 46, backgroundColor: '#e86f6f', transform: [{ rotate: '-10deg' }] }} />
// //       <View style={{ position: 'absolute', right: 14, bottom: '24%', marginBottom: 54, width: 6, height: 50, backgroundColor: '#3f7fc4', transform: [{ rotate: '-22deg' }] }} />
// //       <View style={{ position: 'absolute', right: 30, bottom: '24%', marginBottom: 54, width: 6, height: 44, backgroundColor: '#5fae3a', transform: [{ rotate: '8deg' }] }} />

// //       {/* foreground plant (bottom-left) */}
// //       <Animated.View style={{ position: 'absolute', left: -34, bottom: -26, width: 150, height: 210, transform: [{ rotate: plantR }] }}>
// //         <Leaf l={6} b={0} w={60} h={170} r={-14} c="#6bbb3f" />
// //         <Leaf l={44} b={0} w={56} h={150} r={18} c="#4f9f34" />
// //         <Leaf l={24} b={0} w={50} h={190} r={2} c="#7cc94a" />
// //       </Animated.View>

// //       {/* dust motes */}
// //       {[[40, 5, 9000, 0], [110, 4, 11000, 2500], [180, 6, 10000, 1200], [240, 4, 12000, 4000], [300, 5, 9500, 800], [75, 3, 13000, 6000], [210, 3, 8500, 3200]].map((m, i) => (
// //         <Mote key={i} left={m[0]} size={m[1]} ms={m[2]} delay={m[3]} />
// //       ))}
// //     </View>
// //   );
// // }

// // const eye = StyleSheet.create({ e: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#5b3a29' } });

// // /* =========================================================
// //    VAULT SCENE (the grey card, same layout as the reference picture)
// //    - vault on the left, slides to the right when pushed
// //    - paper with the password is hidden BEHIND the vault
// //    - keypad 1-9 on the wall (top right)
// //    - desk with books (bottom right), decoy
// // ========================================================= */

// // export const SCENE_W = 300;
// // export const SCENE_H = 295;
// // export const VAULT_MAX_SLIDE = 60;

// // type SceneProps = {
// //   moved: boolean; // vault already pushed (server says so)
// //   code: string | null; // password, only given after the vault was moved
// //   opened: boolean; // vault door open
// //   typed: string;
// //   codeLength: number;
// //   onKey: (digit: string) => void;
// //   /** the player tapped (not dragged) the desk or the books */
// //   onThing: (target: 'books' | 'desk') => void;
// //   /** called when the player pushes the vault. Return true when the server accepted it. */
// //   onPush: () => Promise<boolean>;
// //   disabled?: boolean;
// // };

// // /** drag something around with a finger; a tiny move counts as a tap */
// // function useDrag(onTap: () => void, disabled?: boolean) {
// //   const pan = useRef(new Animated.ValueXY()).current;
// //   const R = useRef({ onTap, disabled });
// //   R.current = { onTap, disabled };
// //   const pr = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => !R.current.disabled,
// //       onPanResponderGrant: () => pan.extractOffset(),
// //       onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
// //       onPanResponderRelease: (_, g) => {
// //         pan.flattenOffset();
// //         if (Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6) R.current.onTap();
// //       },
// //       onPanResponderTerminate: () => pan.flattenOffset(),
// //     })
// //   ).current;
// //   return { pan, handlers: pr.panHandlers };
// // }

// // const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// // export function VaultScene15({ moved, code, opened, typed, codeLength, onKey, onThing, onPush, disabled }: SceneProps) {
// //   const slide = useRef(new Animated.Value(moved ? VAULT_MAX_SLIDE : 0)).current;
// //   const P = useRef({ moved, onPush, disabled });
// //   P.current = { moved, onPush, disabled };

// //   // the desk (with the books on it) and the books can both be dragged around
// //   const desk = useDrag(() => onThing('desk'), disabled);
// //   const books = useDrag(() => onThing('books'), disabled);

// //   // password -> dots on the paper (same 3x3 layout as the keypad)
// //   const digits = code ? code.split('').map(Number) : [];
// //   const dot = (d: number) => ({ x: 12 + ((d - 1) % 3) * 14, y: 22 + Math.floor((d - 1) / 3) * 14 });

// //   // server confirms "moved" -> make sure the vault is at the right place
// //   useEffect(() => {
// //     if (moved) Animated.timing(slide, { toValue: VAULT_MAX_SLIDE, duration: 250, useNativeDriver: true }).start();
// //   }, [moved]);

// //   const pr = useRef(
// //     PanResponder.create({
// //       onStartShouldSetPanResponder: () => !P.current.moved && !P.current.disabled,
// //       onPanResponderMove: (_, g) => slide.setValue(Math.max(0, Math.min(VAULT_MAX_SLIDE, g.dx))),
// //       onPanResponderRelease: async (_, g) => {
// //         // tap or a long enough drag pushes the vault, a short drag snaps back
// //         if (Math.abs(g.dx) < 6 || g.dx > 22) {
// //           Animated.timing(slide, { toValue: VAULT_MAX_SLIDE, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
// //           const ok = await P.current.onPush();
// //           if (!ok) Animated.timing(slide, { toValue: 0, duration: 250, useNativeDriver: true }).start();
// //         } else {
// //           Animated.spring(slide, { toValue: 0, useNativeDriver: true }).start();
// //         }
// //       },
// //     })
// //   ).current;

// //   const display = (typed + '_'.repeat(Math.max(0, codeLength - typed.length))).slice(0, codeLength).split('').join(' ');

// //   return (
// //     <View style={sc.card}>
// //       {/* wall, floor, paper, desk */}
// //       <Svg width={SCENE_W} height={SCENE_H} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} style={StyleSheet.absoluteFill}>
// //         <Rect width={SCENE_W} height={SCENE_H} fill="#ededed" />
// //         <Rect y="157" width={SCENE_W} height="138" fill="#dcdcdc" />
// //         <Line x1="0" y1="157" x2={SCENE_W} y2="157" stroke="#3a3a3a" strokeWidth="2" />

// //         {/* paper behind the vault: the password is shown as dots in the keypad layout */}
// //         <G transform="translate(36 92) rotate(-4 26 31)">
// //           <Rect width="52" height="62" fill="#fffdf2" stroke="#8a8a7a" strokeWidth="1.5" />
// //           <Line x1="6" y1="9" x2="46" y2="9" stroke="#cfcfc0" strokeWidth="1" />
// //           {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
// //             <Circle key={i} cx={12 + (i % 3) * 14} cy={22 + Math.floor(i / 3) * 14} r="2.4" fill="none" stroke="#b9b9aa" strokeWidth="1" />
// //           ))}
// //           {moved && digits.length > 0 ? (
// //             <G>
// //               {digits.map((d, i) => (
// //                 <Circle key={i} cx={dot(d).x} cy={dot(d).y} r="4.5" fill="#c0392b" />
// //               ))}
// //             </G>
// //           ) : null}
// //         </G>

// //       </Svg>

// //       {/* desk + books: drag them around (nothing is hidden there) */}
// //       <Animated.View
// //         {...desk.handlers}
// //         style={{ position: 'absolute', left: 150, top: 175, width: 150, height: 110, transform: desk.pan.getTranslateTransform() }}
// //       >
// //         <Svg width={150} height={110} viewBox="150 175 150 110">
// //           <Polygon points="162,205 286,192 292,206 168,222" fill="#c8692e" stroke="#4a2410" strokeWidth="1.6" />
// //           <Polygon points="168,222 292,206 288,268 170,276" fill="#b85a22" stroke="#4a2410" strokeWidth="1.6" />
// //           <Polygon points="162,205 168,222 170,276 160,262" fill="#9c4a18" stroke="#4a2410" strokeWidth="1.6" />
// //         </Svg>
// //         <Animated.View
// //           {...books.handlers}
// //           style={{ position: 'absolute', left: 40, top: 5, width: 70, height: 36, transform: books.pan.getTranslateTransform() }}
// //         >
// //           <Svg width={70} height={36} viewBox="190 180 70 36">
// //             <Polygon points="200,198 250,194 252,201 202,205" fill="#5a6fa0" stroke="#222" strokeWidth="1.2" />
// //             <Polygon points="202,205 252,201 252,206 203,210" fill="#7a5a8a" stroke="#222" strokeWidth="1.2" />
// //             <Polygon points="198,190 248,186 250,194 200,198" fill="#3d7fb0" stroke="#222" strokeWidth="1.2" />
// //           </Svg>
// //         </Animated.View>
// //       </Animated.View>

// //       {/* keypad display */}
// //       <View style={sc.display}>
// //         <Text style={sc.displayTxt}>{display}</Text>
// //       </View>

// //       {/* keypad 1-9 */}
// //       {KEYS.map((k, i) => (
// //         <TouchableOpacity
// //           key={k}
// //           activeOpacity={0.6}
// //           disabled={disabled}
// //           onPress={() => onKey(k)}
// //           style={[sc.key, { left: 195 + (i % 3) * 36 - 13, top: 66 + Math.floor(i / 3) * 33 - 13 }]}
// //         >
// //           <Text style={sc.keyTxt}>{k}</Text>
// //         </TouchableOpacity>
// //       ))}

// //       {/* the vault (drag it to the right, or tap it) */}
// //       <Animated.View {...pr.panHandlers} style={{ position: 'absolute', left: 0, top: 0, width: 122, height: 200, transform: [{ translateX: slide }] }}>
// //         <Svg width={122} height={200} viewBox="0 0 122 200">
// //           {/* side handles */}
// //           <Rect x="26" y="96" width="8" height="22" fill="#a5a597" stroke="#333" strokeWidth="1.5" />
// //           <Rect x="26" y="146" width="8" height="22" fill="#a5a597" stroke="#333" strokeWidth="1.5" />
// //           {/* body */}
// //           <Rect x="34" y="67" width="86" height="123" fill={opened ? '#4a4a44' : '#b9b9ac'} stroke="#333" strokeWidth="2" />
// //           {opened ? (
// //             <G>
// //               <Rect x="44" y="80" width="66" height="98" fill="#2e2e2a" />
// //               <Rect x="52" y="146" width="50" height="10" fill="#f6c94a" stroke="#b98a14" strokeWidth="1" />
// //               <Rect x="58" y="134" width="38" height="10" fill="#f6c94a" stroke="#b98a14" strokeWidth="1" />
// //               <Rect x="64" y="122" width="26" height="10" fill="#f6c94a" stroke="#b98a14" strokeWidth="1" />
// //               <SvgText x="77" y="114" textAnchor="middle" fontSize="18" fill="#f6c94a">★</SvgText>
// //             </G>
// //           ) : (
// //             <G>
// //               <Polygon points="34,67 120,67 108,82 46,82" fill="#cfcfc2" opacity="0.7" />
// //               <Circle cx="79" cy="128" r="25" fill="#9b9b8e" stroke="#333" strokeWidth="2" />
// //               <Circle cx="79" cy="128" r="18" fill="#bdbdb0" stroke="#333" strokeWidth="1.6" />
// //               <Circle cx="79" cy="128" r="9" fill="#8d8d80" stroke="#333" strokeWidth="1.6" />
// //               <Circle cx="79" cy="128" r="3" fill="#333" />
// //               <Line x1="79" y1="106" x2="79" y2="112" stroke="#333" strokeWidth="2" />
// //             </G>
// //           )}
// //         </Svg>
// //       </Animated.View>
// //     </View>
// //   );
// // }

// // const sc = StyleSheet.create({
// //   card: {
// //     width: SCENE_W,
// //     height: SCENE_H,
// //     borderRadius: 10,
// //     overflow: 'hidden',
// //     backgroundColor: '#ededed',
// //     elevation: 6,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.25,
// //     shadowRadius: 6,
// //     shadowOffset: { width: 0, height: 3 },
// //   },
// //   display: { position: 'absolute', left: 178, top: 22, width: 96, height: 22, borderRadius: 4, backgroundColor: '#2e2e2a', alignItems: 'center', justifyContent: 'center' },
// //   displayTxt: { fontFamily: F, fontSize: 15, fontWeight: 'bold', color: '#7cfc7c', letterSpacing: 2 },
// //   key: { position: 'absolute', width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', borderWidth: 1.6, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
// //   keyTxt: { fontFamily: F, fontSize: 14, fontWeight: '600', color: '#222', includeFontPadding: false },
// // });
// const express = require('express');
// const l15 = require('../data/level15Db');

// const r = express.Router();

// const HINT_COST = 25;
// const SKIP_COST = 50;
// const REWARD_HINTS = 75;

// /* ---------- WHAT THE PLAYER CAN TAP (decoys) ---------- */

// const TAP_MESSAGES = {
//   books: 'Just some books. Nothing inside.',
//   desk: 'An ordinary desk.',
//   window: 'Nice view, but no code here.',
//   picture: 'A sunny picture.',
//   plant: 'A happy plant.',
//   shelf: 'Only books on the shelf.',
// };

// /* ---------- HELPERS ---------- */

// const handle = (fn) => async (req, res) => {
//   try {
//     await fn(req, res);
//   } catch (err) {
//     console.error('[BrainTwist L15 Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) {
//       res.status(500).json({ success: false, error: 'server_error', message: err.message });
//     }
//   }
// };

// const toId = (value) => {
//   const n = Number(value);
//   return Number.isInteger(n) && n > 0 ? n : null;
// };

// const bad = (res, status, error, message) =>
//   res.status(status).json({ success: false, error, message });

// // what the frontend may see. The code is sent ONLY after the vault was moved.
// const sessionView = (session, hints) => ({
//   success: true,
//   sessionId: session.id,
//   level: l15.LEVEL,
//   status: session.status,
//   vaultMoved: Boolean(session.vault_moved),
//   code: session.vault_moved ? session.code : null,
//   codeLength: l15.CODE_LENGTH,
//   wrongAttempts: Number(session.wrong_attempts),
//   hints,
// });

// // reads ids from body, loads the session, answers the error itself when something is wrong
// const loadSession = async (req, res, { allowFinished = false } = {}) => {
//   const sessionId = toId(req.body?.sessionId);
//   const playerId = toId(req.body?.playerId);

//   if (!sessionId || !playerId) {
//     bad(res, 400, 'ids_required', 'sessionId and playerId are required');
//     return null;
//   }

//   const session = await l15.getSession(sessionId, playerId);
//   if (!session) {
//     bad(res, 404, 'no_session', 'Session not found');
//     return null;
//   }

//   if (!allowFinished && session.status !== 'in_progress') {
//     bad(res, 409, 'already_finished', 'This level is already finished');
//     return null;
//   }

//   return { session, playerId };
// };

// r.use(async (req, res, next) => {
//   await l15.ready;
//   next();
// });

// /* ---------------------------------------------------------
//    POST /level15/start     body: { playerId }
// --------------------------------------------------------- */

// r.post('/start', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const player = await l15.getPlayer(playerId);
//   if (!player) return bad(res, 404, 'no_player', 'Player not found');

//   // continue an unfinished game, otherwise start a new one with a new password
//   let session = await l15.getActiveSession(playerId);

//   // an old unfinished game with a repeated-digit code is replaced (the dots need 4 different digits)
//   if (session && new Set(String(session.code).split('')).size !== String(session.code).length) {
//     await l15.abandonSession(session.id);
//     session = null;
//   }
//   if (!session) session = await l15.createSession(playerId);

//   // opening the level again: the vault is back in its place and the paper is hidden
//   if (session.vault_moved) {
//     await l15.resetVault(session.id);
//     session.vault_moved = 0;
//   }

//   res.json({
//     ...sessionView(session, Number(player.hints) || 0),
//     title: 'We must open this vault.',
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/move      body: { sessionId, playerId }
//    the player pushed the vault aside -> the paper behind it is shown
// --------------------------------------------------------- */

// r.post('/move', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   if (!session.vault_moved) {
//     await l15.markVaultMoved(session.id);
//     await l15.recordAction(session.id, 'move', 'vault', true);
//     session.vault_moved = 1;
//   }

//   res.json({
//     ...sessionView(session, await l15.getHints(playerId)),
//     message: 'A paper was hidden behind the vault!',
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/tap       body: { sessionId, playerId, target }
//    wrong places (books, desk ...) are saved too
// --------------------------------------------------------- */

// r.post('/tap', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session } = ctx;

//   const target = String(req.body?.target || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 20);
//   if (!TAP_MESSAGES[target]) return bad(res, 400, 'bad_target', 'Unknown target');

//   await l15.recordAction(session.id, 'tap', target, false);
//   await l15.addTap(session.id);

//   res.json({ success: true, correct: false, message: TAP_MESSAGES[target] });
// }));

// /* ---------------------------------------------------------
//    POST /level15/enter     body: { sessionId, playerId, code }
// --------------------------------------------------------- */

// r.post('/enter', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const code = String(req.body?.code || '').replace(/[^0-9]/g, '').slice(0, 8);
//   if (code.length !== l15.CODE_LENGTH) {
//     return bad(res, 400, 'invalid_code', `Code must have ${l15.CODE_LENGTH} digits`);
//   }

//   const wrongBefore = Number(session.wrong_attempts);
//   const attemptsBefore = Number(session.total_attempts);
//   // the paper shows only dots (no order), so the 4 digits are accepted in any order
//   const sortDigits = (c) => String(c).split('').sort().join('');
//   const correct = sortDigits(code) === sortDigits(session.code);

//   await l15.recordAction(session.id, 'code', code, correct);
//   await l15.addAttempt(session.id, !correct);

//   if (!correct) {
//     return res.json({
//       success: true,
//       correct: false,
//       completed: false,
//       wrongAttempts: wrongBefore + 1,
//       message: session.vault_moved
//         ? 'Wrong code. Check the paper again.'
//         : 'Wrong code. Look around, the code is hidden somewhere.',
//     });
//   }

//   // correct -> score, stars, save progress, unlock level 16
//   const attempts = attemptsBefore + 1;
//   const score = Math.max(100, 300 - wrongBefore * 50);
//   const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

//   await l15.completeSession(session.id, Number(session.elapsed) || 0);

//   let progressSaved = false;
//   try {
//     await l15.saveProgress(playerId, score, stars, attempts);
//     progressSaved = true;
//   } catch (err) {
//     console.error('[BrainTwist L15] could not save progress:', err.message);
//   }

//   try {
//     await l15.unlockNext(playerId, attempts);
//   } catch (err) {
//     console.error('[BrainTwist L15] could not unlock next level:', err.message);
//   }

//   res.json({
//     success: true,
//     correct: true,
//     completed: true,
//     message: 'The vault is open!',
//     score,
//     stars,
//     attempts,
//     seconds: Number(session.elapsed) || 0,
//     progressSaved,
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/hint      body: { sessionId, playerId }     costs 25 hints
// --------------------------------------------------------- */

// r.post('/hint', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const left = await l15.spendHints(playerId, HINT_COST);
//   if (left === null) {
//     return bad(res, 402, 'not_enough_hints', `You need ${HINT_COST} hints`);
//   }

//   await l15.markHintUsed(session.id);
//   await l15.recordAction(session.id, 'hint', '', false);

//   res.json({
//     success: true,
//     hints: left,
//     message: session.vault_moved
//       ? 'Type the numbers from the paper on the keypad.'
//       : 'Something is hidden behind the vault. Try to move it.',
//   });
// }));

// /* ---------------------------------------------------------
//    POST /level15/skip      body: { sessionId, playerId }     costs 50 hints
// --------------------------------------------------------- */

// r.post('/skip', handle(async (req, res) => {
//   const ctx = await loadSession(req, res);
//   if (!ctx) return;
//   const { session, playerId } = ctx;

//   const left = await l15.spendHints(playerId, SKIP_COST);
//   if (left === null) {
//     return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
//   }

//   await l15.skipSession(session.id, Number(session.elapsed) || 0);
//   await l15.recordAction(session.id, 'skip', '', false);
//   await l15.unlockNext(playerId, Number(session.total_attempts) || 0);

//   res.json({ success: true, skipped: true, hints: left, message: 'Level skipped' });
// }));

// /* ---------------------------------------------------------
//    POST /level15/reward    body: { playerId }      video reward +75 hints
// --------------------------------------------------------- */

// r.post('/reward', handle(async (req, res) => {
//   const playerId = toId(req.body?.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const hints = await l15.addHints(playerId, REWARD_HINTS);
//   res.json({ success: true, hints, added: REWARD_HINTS });
// }));

// /* ---------------------------------------------------------
//    GET /level15/status/:playerId
// --------------------------------------------------------- */

// r.get('/status/:playerId', handle(async (req, res) => {
//   const playerId = toId(req.params.playerId);
//   if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

//   const row = await l15.getProgress(playerId);

//   res.json({
//     success: true,
//     level: l15.LEVEL,
//     completed: Boolean(row && row.is_completed),
//     score: row ? Number(row.score) || 0 : 0,
//     stars: row ? Number(row.stars) || 0 : 0,
//     attempts: row ? Number(row.attempts) || 0 : 0,
//     completedAt: row ? row.completed_at : null,
//   });
// }));

// module.exports = r;
const express = require('express');
const l15 = require('../data/level15Db');

const r = express.Router();

const HINT_COST = 25;
const SKIP_COST = 50;
const REWARD_HINTS = 75;

/* ---------- WHAT THE PLAYER CAN TAP (decoys) ---------- */

const TAP_MESSAGES = {
  books: 'Just some books. Nothing inside.',
  desk: 'An ordinary desk.',
  window: 'Nice view, but no code here.',
  picture: 'A sunny picture.',
  plant: 'A happy plant.',
  shelf: 'Only books on the shelf.',
};

/* ---------- HELPERS ---------- */

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('[BrainTwist L15 Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'server_error', message: err.message });
    }
  }
};

const toId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const bad = (res, status, error, message) =>
  res.status(status).json({ success: false, error, message });

// what the frontend may see. The code is sent ONLY after the vault was moved.
const sessionView = (session, hints) => ({
  success: true,
  sessionId: session.id,
  level: l15.LEVEL,
  status: session.status,
  vaultMoved: Boolean(session.vault_moved),
  code: session.vault_moved ? session.code : null,
  codeLength: l15.CODE_LENGTH,
  wrongAttempts: Number(session.wrong_attempts),
  hints,
});

// reads ids from body, loads the session, answers the error itself when something is wrong
const loadSession = async (req, res, { allowFinished = false } = {}) => {
  const sessionId = toId(req.body?.sessionId);
  const playerId = toId(req.body?.playerId);

  if (!sessionId || !playerId) {
    bad(res, 400, 'ids_required', 'sessionId and playerId are required');
    return null;
  }

  const session = await l15.getSession(sessionId, playerId);
  if (!session) {
    bad(res, 404, 'no_session', 'Session not found');
    return null;
  }

  if (!allowFinished && session.status !== 'in_progress') {
    bad(res, 409, 'already_finished', 'This level is already finished');
    return null;
  }

  return { session, playerId };
};

r.use(async (req, res, next) => {
  await l15.ready;
  next();
});

/* ---------------------------------------------------------
   POST /level15/start     body: { playerId }
--------------------------------------------------------- */

r.post('/start', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const player = await l15.getPlayer(playerId);
  if (!player) return bad(res, 404, 'no_player', 'Player not found');

  // continue an unfinished game, otherwise start a new one with a new password
  let session = await l15.getActiveSession(playerId);

  // an old unfinished game with a repeated-digit code is replaced (the dots need 4 different digits)
  if (session && new Set(String(session.code).split('')).size !== String(session.code).length) {
    await l15.abandonSession(session.id);
    session = null;
  }
  if (!session) session = await l15.createSession(playerId);

  // opening the level again: the vault is back in its place and the paper is hidden
  if (session.vault_moved) {
    await l15.resetVault(session.id);
    session.vault_moved = 0;
  }

  res.json({
    ...sessionView(session, Number(player.hints) || 0),
    title: 'We must open this vault.',
  });
}));

/* ---------------------------------------------------------
   POST /level15/move      body: { sessionId, playerId }
   the player pushed the vault aside -> the paper behind it is shown
--------------------------------------------------------- */

r.post('/move', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  if (!session.vault_moved) {
    await l15.markVaultMoved(session.id);
    await l15.recordAction(session.id, 'move', 'vault', true);
    session.vault_moved = 1;
  }

  res.json({
    ...sessionView(session, await l15.getHints(playerId)),
    message: 'A paper was hidden behind the vault!',
  });
}));

/* ---------------------------------------------------------
   POST /level15/tap       body: { sessionId, playerId, target }
   wrong places (books, desk ...) are saved too
--------------------------------------------------------- */

r.post('/tap', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session } = ctx;

  const target = String(req.body?.target || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 20);
  if (!TAP_MESSAGES[target]) return bad(res, 400, 'bad_target', 'Unknown target');

  await l15.recordAction(session.id, 'tap', target, false);
  await l15.addTap(session.id);

  res.json({ success: true, correct: false, message: TAP_MESSAGES[target] });
}));

/* ---------------------------------------------------------
   POST /level15/enter     body: { sessionId, playerId, code }
--------------------------------------------------------- */

r.post('/enter', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const code = String(req.body?.code || '').replace(/[^0-9]/g, '').slice(0, 8);
  if (code.length !== l15.CODE_LENGTH) {
    return bad(res, 400, 'invalid_code', `Code must have ${l15.CODE_LENGTH} digits`);
  }

  const wrongBefore = Number(session.wrong_attempts);
  const attemptsBefore = Number(session.total_attempts);
  // the paper shows only dots (no order), so the 4 digits are accepted in any order
  const sortDigits = (c) => String(c).split('').sort().join('');
  const correct = sortDigits(code) === sortDigits(session.code);

  await l15.recordAction(session.id, 'code', code, correct);
  await l15.addAttempt(session.id, !correct);

  if (!correct) {
    return res.json({
      success: true,
      correct: false,
      completed: false,
      wrongAttempts: wrongBefore + 1,
      message: session.vault_moved
        ? 'Wrong code. Check the paper again.'
        : 'Wrong code. Look around, the code is hidden somewhere.',
    });
  }

  // correct -> score, stars, save progress, unlock level 16
  const attempts = attemptsBefore + 1;
  const score = Math.max(100, 300 - wrongBefore * 50);
  const stars = wrongBefore === 0 ? 3 : wrongBefore <= 2 ? 2 : 1;

  await l15.completeSession(session.id, Number(session.elapsed) || 0);

  let progressSaved = false;
  try {
    await l15.saveProgress(playerId, score, stars, attempts);
    progressSaved = true;
  } catch (err) {
    console.error('[BrainTwist L15] could not save progress:', err.message);
  }

  try {
    await l15.unlockNext(playerId, attempts);
  } catch (err) {
    console.error('[BrainTwist L15] could not unlock next level:', err.message);
  }

  res.json({
    success: true,
    correct: true,
    completed: true,
    message: 'The vault is open!',
    score,
    stars,
    attempts,
    seconds: Number(session.elapsed) || 0,
    progressSaved,
  });
}));

/* ---------------------------------------------------------
   POST /level15/hint      body: { sessionId, playerId }     costs 25 hints
--------------------------------------------------------- */

r.post('/hint', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const left = await l15.spendHints(playerId, HINT_COST);
  if (left === null) {
    return bad(res, 402, 'not_enough_hints', `You need ${HINT_COST} hints`);
  }

  await l15.markHintUsed(session.id);
  await l15.recordAction(session.id, 'hint', '', false);

  res.json({
    success: true,
    hints: left,
    message: session.vault_moved
      ? 'Type the numbers from the paper on the keypad.'
      : 'Something is hidden behind the vault. Try to move it.',
  });
}));

/* ---------------------------------------------------------
   POST /level15/skip      body: { sessionId, playerId }     costs 50 hints
--------------------------------------------------------- */

r.post('/skip', handle(async (req, res) => {
  const ctx = await loadSession(req, res);
  if (!ctx) return;
  const { session, playerId } = ctx;

  const left = await l15.spendHints(playerId, SKIP_COST);
  if (left === null) {
    return bad(res, 402, 'not_enough_hints', `You need ${SKIP_COST} hints`);
  }

  await l15.skipSession(session.id, Number(session.elapsed) || 0);
  await l15.recordAction(session.id, 'skip', '', false);
  await l15.unlockNext(playerId, Number(session.total_attempts) || 0);

  res.json({ success: true, skipped: true, hints: left, message: 'Level skipped' });
}));

/* ---------------------------------------------------------
   POST /level15/reward    body: { playerId }      video reward +75 hints
--------------------------------------------------------- */

r.post('/reward', handle(async (req, res) => {
  const playerId = toId(req.body?.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const hints = await l15.addHints(playerId, REWARD_HINTS);
  res.json({ success: true, hints, added: REWARD_HINTS });
}));

/* ---------------------------------------------------------
   GET /level15/status/:playerId
--------------------------------------------------------- */

r.get('/status/:playerId', handle(async (req, res) => {
  const playerId = toId(req.params.playerId);
  if (!playerId) return bad(res, 400, 'playerId_required', 'playerId is required');

  const row = await l15.getProgress(playerId);

  res.json({
    success: true,
    level: l15.LEVEL,
    completed: Boolean(row && row.is_completed),
    score: row ? Number(row.score) || 0 : 0,
    stars: row ? Number(row.stars) || 0 : 0,
    attempts: row ? Number(row.attempts) || 0 : 0,
    completedAt: row ? row.completed_at : null,
  });
}));

module.exports = r;