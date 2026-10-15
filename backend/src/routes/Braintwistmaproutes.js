// // const express = require('express');
// // const db = require('../db');

// // const r = express.Router();

// // const MAP_SIZE = 13; // nodes drawn on the level map (levels not built yet stay locked)

// // const handle = (fn) => async (req, res) => {
// //   try { await fn(req, res); }
// //   catch (err) {
// //     console.error('[BrainTwist Map Error]', req.method, req.originalUrl, err);
// //     if (!res.headersSent) res.status(500).json({ error: 'server_error', message: err.message });
// //   }
// // };

// // const realTotal = async () => {
// //   const [rows] = await db.query('SELECT MAX(n) AS m FROM bt_levels');
// //   return Number(rows[0] && rows[0].m) || 1;
// // };

// // const playerExists = async (id) => {
// //   if (!Number.isInteger(id) || id < 1) return false;
// //   const [rows] = await db.query('SELECT id FROM bt_players WHERE id = ?', [id]);
// //   return rows.length > 0;
// // };

// // // builds the whole map for one player
// // const buildMap = async (playerId) => {
// //   const total = await realTotal();
// //   const [rows] = await db.query(
// //     'SELECT level_n, attempts FROM bt_progress WHERE player_id = ? AND solved_at IS NOT NULL',
// //     [playerId]
// //   );
// //   const done = new Map(rows.map((x) => [Number(x.level_n), Number(x.attempts) || 0]));

// //   let current = 0;
// //   for (let n = 1; n <= total; n++) {
// //     if (!done.has(n)) { current = n; break; }
// //   }

// //   const levels = [];
// //   for (let n = 1; n <= Math.max(MAP_SIZE, total); n++) {
// //     let status = 'locked';
// //     if (done.has(n)) status = 'completed';
// //     else if (n === current) status = 'current';
// //     const tries = done.get(n) || 0;
// //     levels.push({
// //       n,
// //       status,                                   // completed | current | locked
// //       playable: status === 'current',           // completed levels are locked for replay
// //       stars: status === 'completed' ? (tries <= 1 ? 3 : tries === 2 ? 2 : 1) : 0,
// //     });
// //   }

// //   return { playerId, total, currentLevel: current || total, finished: current === 0, levels };
// // };

// // // GET /api/braintwist/map/:playerId
// // r.get('/:playerId', handle(async (req, res) => {
// //   const id = Number(req.params.playerId);
// //   if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
// //   res.json(await buildMap(id));
// // }));

// // // POST /api/braintwist/map/:playerId/open   { level }
// // // the backend decides whether this level may be opened (completed / future levels are refused)
// // r.post('/:playerId/open', handle(async (req, res) => {
// //   const id = Number(req.params.playerId);
// //   const n = Number(req.body && req.body.level);
// //   if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
// //   const map = await buildMap(id);
// //   const lv = map.levels.find((x) => x.n === n);
// //   if (!lv || n > map.total) return res.status(403).json({ error: 'locked', message: 'This level is not available yet.', map });
// //   if (lv.status === 'completed') return res.status(403).json({ error: 'completed', message: 'Level already completed and locked.', map });
// //   if (lv.status === 'locked') return res.status(403).json({ error: 'locked', message: 'Finish the previous level first.', map });
// //   res.json({ ok: true, level: n, map });
// // }));

// // // POST /api/braintwist/map/:playerId/complete   { level, attempts }
// // // saves the level as solved (=> locked for replay) and unlocks the next one
// // r.post('/:playerId/complete', handle(async (req, res) => {
// //   const id = Number(req.params.playerId);
// //   const n = Number(req.body && req.body.level);
// //   const attempts = Math.max(1, Number(req.body && req.body.attempts) || 1);
// //   if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
// //   const total = await realTotal();
// //   if (!Number.isInteger(n) || n < 1 || n > total) return res.status(400).json({ error: 'bad_level' });

// //   const before = await buildMap(id);
// //   const lv = before.levels.find((x) => x.n === n);
// //   // only the current level can be completed (blocks cheating / double submit)
// //   if (lv.status === 'locked') return res.status(403).json({ error: 'locked', map: before });

// //   if (lv.status === 'current') {
// //     await db.query(
// //       `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
// //        VALUES (?, ?, ?, NOW())
// //        ON DUPLICATE KEY UPDATE attempts = VALUES(attempts), solved_at = COALESCE(solved_at, NOW())`,
// //       [id, n, attempts]
// //     );
// //     await db.query(
// //       'UPDATE bt_players SET current_level = GREATEST(COALESCE(current_level, 1), ?) WHERE id = ?',
// //       [n + 1, id]
// //     );
// //   }
// //   const map = await buildMap(id);
// //   res.json({ ok: true, completed: n, nextLevel: map.finished ? null : map.currentLevel, map });
// // }));

// // module.exports = r;
// const express = require('express');
// const db = require('../db');

// const r = express.Router();

// const MAP_SIZE = 13; // nodes drawn on the level map (levels not built yet show "Coming soon")

// const handle = (fn) => async (req, res) => {
//   try { await fn(req, res); }
//   catch (err) {
//     console.error('[BrainTwist Map Error]', req.method, req.originalUrl, err);
//     if (!res.headersSent) res.status(500).json({ error: 'server_error', message: err.message });
//   }
// };

// const realTotal = async () => {
//   const [rows] = await db.query('SELECT MAX(n) AS m FROM bt_levels');
//   return Number(rows[0] && rows[0].m) || 1;
// };

// const playerExists = async (id) => {
//   if (!Number.isInteger(id) || id < 1) return false;
//   const [rows] = await db.query('SELECT id FROM bt_players WHERE id = ?', [id]);
//   return rows.length > 0;
// };

// // builds the whole map for one player
// // status: completed | current | open | soon   (nothing is locked any more)
// const buildMap = async (playerId) => {
//   const total = await realTotal();
//   const [rows] = await db.query(
//     'SELECT level_n, attempts FROM bt_progress WHERE player_id = ? AND solved_at IS NOT NULL',
//     [playerId]
//   );
//   const done = new Map(rows.map((x) => [Number(x.level_n), Number(x.attempts) || 0]));

//   let current = 0;
//   for (let n = 1; n <= total; n++) {
//     if (!done.has(n)) { current = n; break; }
//   }

//   const levels = [];
//   for (let n = 1; n <= Math.max(MAP_SIZE, total); n++) {
//     let status;
//     if (n > total) status = 'soon';                 // level not built yet
//     else if (done.has(n)) status = 'completed';
//     else if (n === current) status = 'current';
//     else status = 'open';                           // every built level can be played
//     const tries = done.get(n) || 0;
//     levels.push({
//       n,
//       status,
//       playable: status !== 'soon',
//       stars: status === 'completed' ? (tries <= 1 ? 3 : tries === 2 ? 2 : 1) : 0,
//     });
//   }

//   return { playerId, total, currentLevel: current || total, finished: current === 0, levels };
// };

// // GET /api/braintwist/map/:playerId
// r.get('/:playerId', handle(async (req, res) => {
//   const id = Number(req.params.playerId);
//   if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
//   res.json(await buildMap(id));
// }));

// // POST /api/braintwist/map/:playerId/open   { level }
// // any built level can be opened; only levels that do not exist yet are refused
// r.post('/:playerId/open', handle(async (req, res) => {
//   const id = Number(req.params.playerId);
//   const n = Number(req.body && req.body.level);
//   if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
//   const map = await buildMap(id);
//   const lv = map.levels.find((x) => x.n === n);
//   if (!lv || lv.status === 'soon') {
//     return res.status(403).json({ error: 'soon', message: 'Coming soon!', map });
//   }
//   res.json({ ok: true, level: n, map });
// }));

// // POST /api/braintwist/map/:playerId/complete   { level, attempts }
// // saves the level as solved the first time it is finished
// r.post('/:playerId/complete', handle(async (req, res) => {
//   const id = Number(req.params.playerId);
//   const n = Number(req.body && req.body.level);
//   const attempts = Math.max(1, Number(req.body && req.body.attempts) || 1);
//   if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
//   const total = await realTotal();
//   if (!Number.isInteger(n) || n < 1 || n > total) return res.status(400).json({ error: 'bad_level' });

//   const before = await buildMap(id);
//   const lv = before.levels.find((x) => x.n === n);

//   // first time this level is solved -> save it (replays do not overwrite the first result)
//   if (lv && lv.status !== 'completed') {
//     await db.query(
//       `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
//        VALUES (?, ?, ?, NOW())
//        ON DUPLICATE KEY UPDATE attempts = VALUES(attempts), solved_at = COALESCE(solved_at, NOW())`,
//       [id, n, attempts]
//     );
//     await db.query(
//       'UPDATE bt_players SET current_level = GREATEST(COALESCE(current_level, 1), ?) WHERE id = ?',
//       [n + 1, id]
//     );
//   }
//   const map = await buildMap(id);
//   res.json({ ok: true, completed: n, nextLevel: map.finished ? null : map.currentLevel, map });
// }));

// module.exports = r;
const express = require('express');
const db = require('../db');

const r = express.Router();

const MAP_SIZE = 13; // nodes drawn on the level map (levels not built yet show "Coming soon")

console.log('[BrainTwist Map] NEW unlocked version loaded');

const handle = (fn) => async (req, res) => {
  try { await fn(req, res); }
  catch (err) {
    console.error('[BrainTwist Map Error]', req.method, req.originalUrl, err);
    if (!res.headersSent) res.status(500).json({ error: 'server_error', message: err.message });
  }
};

const realTotal = async () => {
  const [rows] = await db.query('SELECT MAX(n) AS m FROM bt_levels');
  return Number(rows[0] && rows[0].m) || 1;
};

const playerExists = async (id) => {
  if (!Number.isInteger(id) || id < 1) return false;
  const [rows] = await db.query('SELECT id FROM bt_players WHERE id = ?', [id]);
  return rows.length > 0;
};

// builds the whole map for one player
// status: completed | current | open | soon   (nothing is locked any more)
const buildMap = async (playerId) => {
  const total = await realTotal();
  const [rows] = await db.query(
    'SELECT level_n, attempts FROM bt_progress WHERE player_id = ? AND solved_at IS NOT NULL',
    [playerId]
  );
  const done = new Map(rows.map((x) => [Number(x.level_n), Number(x.attempts) || 0]));

  let current = 0;
  for (let n = 1; n <= total; n++) {
    if (!done.has(n)) { current = n; break; }
  }

  const levels = [];
  for (let n = 1; n <= Math.max(MAP_SIZE, total); n++) {
    let status;
    if (n > total) status = 'soon';                 // level not built yet
    else if (done.has(n)) status = 'completed';
    else if (n === current) status = 'current';
    else status = 'open';                           // every built level can be played
    const tries = done.get(n) || 0;
    levels.push({
      n,
      status,
      playable: status !== 'soon',
      stars: status === 'completed' ? (tries <= 1 ? 3 : tries === 2 ? 2 : 1) : 0,
    });
  }

  return { playerId, total, currentLevel: current || total, finished: current === 0, levels };
};

// GET /api/braintwist/map/:playerId
r.get('/:playerId', handle(async (req, res) => {
  const id = Number(req.params.playerId);
  if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
  res.json(await buildMap(id));
}));

// POST /api/braintwist/map/:playerId/open   { level }
// any built level can be opened; only levels that do not exist yet are refused
r.post('/:playerId/open', handle(async (req, res) => {
  console.log('[BrainTwist Map] OPEN hit', req.params.playerId, req.body);
  const id = Number(req.params.playerId);
  const n = Number(req.body && req.body.level);
  if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
  const map = await buildMap(id);
  const lv = map.levels.find((x) => x.n === n);
  if (!lv || lv.status === 'soon') {
    return res.status(403).json({ error: 'soon', message: 'Coming soon!', map });
  }
  res.json({ ok: true, level: n, map });
}));

// POST /api/braintwist/map/:playerId/complete   { level, attempts }
// saves the level as solved the first time it is finished
r.post('/:playerId/complete', handle(async (req, res) => {
  const id = Number(req.params.playerId);
  const n = Number(req.body && req.body.level);
  const attempts = Math.max(1, Number(req.body && req.body.attempts) || 1);
  if (!(await playerExists(id))) return res.status(404).json({ error: 'player_not_found' });
  const total = await realTotal();
  if (!Number.isInteger(n) || n < 1 || n > total) return res.status(400).json({ error: 'bad_level' });

  const before = await buildMap(id);
  const lv = before.levels.find((x) => x.n === n);

  // first time this level is solved -> save it (replays do not overwrite the first result)
  if (lv && lv.status !== 'completed') {
    await db.query(
      `INSERT INTO bt_progress (player_id, level_n, attempts, solved_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE attempts = VALUES(attempts), solved_at = COALESCE(solved_at, NOW())`,
      [id, n, attempts]
    );
    await db.query(
      'UPDATE bt_players SET current_level = GREATEST(COALESCE(current_level, 1), ?) WHERE id = ?',
      [n + 1, id]
    );
  }
  const map = await buildMap(id);
  res.json({ ok: true, completed: n, nextLevel: map.finished ? null : map.currentLevel, map });
}));

module.exports = r;