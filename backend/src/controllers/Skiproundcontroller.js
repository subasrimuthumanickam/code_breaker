// TODO: ungal existing mysql2/promise pool file
// const pool = require('../config/db');
const pool = require('../db');
const SKIPS_PER_COMPLETION = 1; // 10 rounds mudinja ethana skip kudukkanum

// TODO (mukkiyam): ungal DB la "indha player 10 rounds um mudichirukkaara" nu
// verify pannunga. illana yaarum API-a thirumba thirumba call panni skip
// farm pannidalaam. Ippo dev ku always true.
async function hasCompletedAllRounds(playerName, totalRounds) {
  // example:
  // const [[r]] = await pool.query('SELECT COUNT(*) c FROM round_answers WHERE player_name=? AND is_correct=1', [playerName]);
  // return r.c >= totalRounds;
  return true;
}

// TODO: ungal real stats query. Ippo client anupura value-a fallback-a use pannudhu.
async function getCompletionStats(playerName, totalRounds, fallbackStars) {
  // example:
  // const [[s]] = await pool.query('SELECT score FROM ws_players WHERE player_name=?', [playerName]);
  return { roundsCompleted: totalRounds, totalRounds, starsEarned: Number(fallbackStars) || 0 };
}

const getSkips = async (conn, playerName) => {
  const [[row]] = await conn.query('SELECT skips FROM ws_skip_wallet WHERE player_name = ?', [playerName]);
  return row ? row.skips : 0;
};

// GET /api/skip/status/:playerName
exports.status = async (req, res) => {
  try {
    res.json({ success: true, skips: await getSkips(pool, req.params.playerName) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/skip/claim   body: { playerName, setKey, totalRounds, starsEarned }
// 10 rounds mudinja apram: reward kudukkum + summary stats anupum
exports.claim = async (req, res) => {
  const { playerName, setKey, totalRounds, starsEarned } = req.body;
  if (!playerName || !setKey || !totalRounds) {
    return res.status(400).json({ success: false, message: 'playerName, setKey, totalRounds required' });
  }

  let conn;
  try {
    if (!(await hasCompletedAllRounds(playerName, Number(totalRounds)))) {
      return res.status(403).json({ success: false, message: 'Rounds not completed yet' });
    }
    const stats = await getCompletionStats(playerName, Number(totalRounds), starsEarned);

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // INSERT IGNORE -> already claim pannirundha affectedRows = 0
    const [ins] = await conn.query(
      'INSERT IGNORE INTO ws_skip_claims (player_name, set_key) VALUES (?, ?)',
      [playerName, String(setKey)]
    );
    const awarded = ins.affectedRows === 1;

    if (awarded) {
      await conn.query(
        `INSERT INTO ws_skip_wallet (player_name, skips) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE skips = skips + VALUES(skips)`,
        [playerName, SKIPS_PER_COMPLETION]
      );
    }
    const skips = await getSkips(conn, playerName);
    await conn.commit();

    res.json({ success: true, awarded, reward: awarded ? SKIPS_PER_COMPLETION : 0, skips, stats });
  } catch (e) {
    if (conn) await conn.rollback();
    console.error('skip claim error', e);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    if (conn) conn.release();
  }
};

// POST /api/skip/use   body: { playerName, roundId, roundNumber }
exports.useSkip = async (req, res) => {
  const { playerName, roundId, roundNumber } = req.body;
  if (!playerName || !roundId) {
    return res.status(400).json({ success: false, message: 'playerName and roundId required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1) skip token irukka nu check panni atomic-a 1 kuraikkum (race condition illa)
    const [upd] = await conn.query(
      'UPDATE ws_skip_wallet SET skips = skips - 1 WHERE player_name = ? AND skips > 0',
      [playerName]
    );
    if (upd.affectedRows === 0) {
      await conn.rollback();
      return res.json({ success: false, insufficient: true, skips: await getSkips(pool, playerName), message: 'No skips left' });
    }

    // 2) indha round already skip pannirundha duplicate error -> rollback (token poga koodathu)
    await conn.query(
      'INSERT INTO ws_skipped_rounds (player_name, round_id, round_number) VALUES (?, ?, ?)',
      [playerName, String(roundId), roundNumber ?? null]
    );

    const skips = await getSkips(conn, playerName);
    await conn.commit();
    res.json({ success: true, skips });
  } catch (e) {
    if (conn) await conn.rollback();
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Round already skipped', skips: await getSkips(pool, playerName) });
    }
    console.error('skip use error', e);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    if (conn) conn.release();
  }
};