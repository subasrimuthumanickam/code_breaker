

const HINT_COST = 25;

// router.post('/hint', ...)
async function hintHandler(req, res) {
  const { sessionId, playerId } = req.body;
  const conn = await pool.getConnection();            // your mysql2 pool
  try {
    await conn.beginTransaction();

    const [[session]] = await conn.query(
      'SELECT id, clue_used FROM bt_level5_sessions WHERE id=? AND player_id=? FOR UPDATE',
      [sessionId, playerId]
    );
    if (!session) {
      await conn.rollback();
      return res.status(404).json({ error: 'not_found', message: 'Session not found' });
    }

    const [[player]] = await conn.query(
      'SELECT hints FROM players WHERE id=? FOR UPDATE',          // <- your hints table/column
      [playerId]
    );

    // clue already bought -> return again, charge NOTHING
    if (session.clue_used) {
      await conn.commit();
      return res.json({ itemId: 0, hints: player.hints, cost: 0, alreadyUsed: true });
    }

    // hints only (never coins, never video)
    if (player.hints < HINT_COST) {
      await conn.rollback();
      return res.status(402).json({
        error: 'not_enough_hints',
        message: `You need ${HINT_COST} hints. Watch a video to earn more!`,
      });
    }

    await conn.query('UPDATE players SET hints = hints - ? WHERE id=?', [HINT_COST, playerId]);
    await conn.query('UPDATE bt_level5_sessions SET clue_used=1 WHERE id=?', [sessionId]);

    await conn.commit();
    res.json({ itemId: 0, hints: player.hints - HINT_COST, cost: HINT_COST });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: 'server', message: 'Server error' });
  } finally {
    conn.release();
  }
}

module.exports = hintHandler;