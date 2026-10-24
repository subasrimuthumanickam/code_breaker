
const db = require("../db");
const {
  HINT_COST,
  ROUND_COMPLETION_REWARD_COINS,
  ROUND_THREE_GIFT_BONUS_COINS,
  LEVEL_BLOCK_SIZE,
  LEVEL_BLOCK_BONUS,
  SPIN_SEGMENTS,
  pickSpinSegment,
} = require("../utils/coinConfig");

/* ---------- helpers ---------- */

// Ensures the wallet row exists and locks it for this transaction.
const lockWallet = async (conn, playerName) => {
  await conn.query("INSERT IGNORE INTO ws_player_wallet (player_name) VALUES (?)", [playerName]);
  await conn.query("SELECT coins FROM ws_player_wallet WHERE player_name = ? FOR UPDATE", [playerName]);
};

// Current wallet in the shape sent to the app.
const snapshot = async (conn, playerName) => {
  const [rows] = await conn.query(
    "SELECT coins, hint_tokens, bonus_seconds FROM ws_player_wallet WHERE player_name = ?",
    [playerName]
  );
  const r = rows[0] || { coins: 0, hint_tokens: 0, bonus_seconds: 0 };
  return { coins: r.coins, hintTokens: r.hint_tokens, bonusSeconds: r.bonus_seconds };
};

const getCompletedRound = async (conn, roundId) => {
  const [rounds] = await conn.query(
    `SELECT id, round_number, word, words_json
       FROM word_scramble_rounds
      WHERE id = ?
      FOR UPDATE`,
    [roundId]
  );
  const round = rounds[0];
  if (!round) return null;

  let words = [];
  try {
    words = JSON.parse(round.words_json || "[]");
  } catch (error) {
    words = [];
  }
  if (!Array.isArray(words) || words.length === 0) {
    words = round.word ? [round.word] : [];
  }
  if (words.length === 0) return null;

  const [[found]] = await conn.query(
    `SELECT COUNT(DISTINCT word) AS count
       FROM word_scramble_found_words
      WHERE round_id = ?`,
    [roundId]
  );

  return Number(found.count) >= words.length ? round : null;
};

// Adds coins once per (player, refKey). Returns false if it was already paid.
const grantOnce = async (conn, { playerName, type, amount, roundId, level, refKey }) => {
  const [result] = await conn.query(
    `INSERT IGNORE INTO ws_coin_transactions (player_name, type, amount, round_id, level, ref_key)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [playerName, type, amount, roundId ?? null, level ?? null, refKey]
  );
  if (result.affectedRows === 0) return false;
  await conn.query("UPDATE ws_player_wallet SET coins = coins + ? WHERE player_name = ?", [amount, playerName]);
  return true;
};

// Runs fn inside a transaction and always releases the connection.
const withTx = async (fn) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const out = await fn(conn);
    await conn.commit();
    return out;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const bad = (res, message) => res.status(400).json({ success: false, message });
const fail = (res, err) => {
  console.error("[coins]", err);
  return res.status(500).json({ success: false, message: "Server error" });
};

// What the app is allowed to know about a segment (never the weights).
const publicSegment = ({ id, type, amount, label, emoji, color }) => ({ id, type, amount, label, emoji, color });

/* ---------- GET /coins/:playerName ---------- */
exports.getCoins = async (req, res) => {
  try {
    const playerName = String(req.params.playerName || "").trim();
    if (!playerName) return bad(res, "playerName required");
    const wallet = await snapshot(db, playerName);
    return res.json({ success: true, ...wallet });
  } catch (err) {
    return fail(res, err);
  }
};

/* ---------- POST /coins/hint  { playerName, roundId } ----------
  Uses a gift token first, then spends HINT_COST coins. */
exports.spendHint = async (req, res) => {
  try {
    const { playerName, roundId } = req.body || {};
    if (!playerName) return bad(res, "playerName required");
    const rid = roundId != null ? String(roundId) : null;

    const out = await withTx(async (conn) => {
      await lockWallet(conn, playerName);

      const [tokenUpdate] = await conn.query(
        "UPDATE ws_player_wallet SET hint_tokens = hint_tokens - 1 WHERE player_name = ? AND hint_tokens > 0",
        [playerName]
      );
      if (tokenUpdate.affectedRows === 1) {
        await conn.query(
          `INSERT INTO ws_coin_transactions (player_name, type, amount, round_id, ref_key, note)
           VALUES (?, 'hint', 0, ?, NULL, 'gift_token')`,
          [playerName, rid]
        );
        return { ok: true, usedToken: true, wallet: await snapshot(conn, playerName) };
      }

      const [coinUpdate] = await conn.query(
        "UPDATE ws_player_wallet SET coins = coins - ? WHERE player_name = ? AND coins >= ?",
        [HINT_COST, playerName, HINT_COST]
      );
      const wallet = await snapshot(conn, playerName);
      if (coinUpdate.affectedRows === 0) return { ok: false, wallet };

      await conn.query(
        `INSERT INTO ws_coin_transactions (player_name, type, amount, round_id, ref_key, note)
         VALUES (?, 'hint', ?, ?, NULL, 'coins')`,
        [playerName, -HINT_COST, rid]
      );
      return { ok: true, usedToken: false, wallet };
    });

    if (!out.ok) {
      return res.status(402).json({
        success: false,
        insufficient: true,
        cost: HINT_COST,
        message: "Not enough coins",
        ...out.wallet,
      });
    }
    return res.json({
      success: true,
      usedToken: out.usedToken,
      cost: out.usedToken ? 0 : HINT_COST,
      ...out.wallet,
    });
  } catch (err) {
    return fail(res, err);
  }
};

/* ---------- POST /coins/level-complete  { playerName, roundId, level } ----------
  Grants +30 coins after rounds 5, 10, 15, etc. */
exports.levelComplete = async (req, res) => {
  try {
    const { playerName, roundId, level } = req.body || {};
    const lvl = Number(level);
    if (!playerName || roundId === undefined || !Number.isInteger(lvl) || lvl < 1) {
      return bad(res, "playerName, roundId and round number required");
    }

    const out = await withTx(async (conn) => {
      await lockWallet(conn, playerName);
      const round = await getCompletedRound(conn, roundId);
      if (!round) return { completed: false, wallet: await snapshot(conn, playerName) };

      const roundNumber = Number(round.round_number);
      if (roundNumber !== lvl) {
        return { completed: false, wallet: await snapshot(conn, playerName) };
      }

      const completionRecorded = await grantOnce(conn, {
        playerName,
        type: "level_bonus",
        amount: 0,
        roundId: String(roundId),
        level: roundNumber,
        refKey: `round:${roundId}:completion`,
      });

      const roundRewardGranted = await grantOnce(conn, {
        playerName,
        type: "gift",
        amount: ROUND_COMPLETION_REWARD_COINS,
        roundId: String(roundId),
        level: roundNumber,
        refKey: `round:${roundId}:completion-coins`,
      });

      const giftBonusGranted = roundNumber === 3
        ? await grantOnce(conn, {
            playerName,
            type: "gift",
            amount: ROUND_THREE_GIFT_BONUS_COINS,
            roundId: String(roundId),
            level: roundNumber,
            refKey: `round:${roundId}:third-round-gift`,
          })
        : false;

      if (giftBonusGranted) {
        await conn.query(
          "UPDATE ws_player_wallet SET hint_tokens = hint_tokens + 1 WHERE player_name = ?",
          [playerName]
        );
      }

      const [[completionCount]] = await conn.query(
        `SELECT COUNT(*) AS total
           FROM ws_coin_transactions
          WHERE player_name = ?
            AND type = 'level_bonus'
            AND ref_key LIKE 'round:%:completion'`,
        [playerName]
      );
      const completedRounds = Number(completionCount.total) || 0;
      const isMilestone =
        completionRecorded &&
        completedRounds > 0 &&
        completedRounds % LEVEL_BLOCK_SIZE === 0;

      let bonusGranted = false;
      if (isMilestone) {
        bonusGranted = await grantOnce(conn, {
          playerName,
          type: "level_bonus",
          amount: LEVEL_BLOCK_BONUS,
          roundId: String(roundId),
          level: roundNumber,
          refKey: `milestone:${completedRounds}`,
        });
      }

      return {
        completed: true,
        roundRewardGranted,
        giftBonusGranted,
        bonusGranted,
        isMilestone,
        wallet: await snapshot(conn, playerName),
      };
    });

    if (!out.completed) {
      return res.status(409).json({ success: false, message: "Round is not complete", ...out.wallet });
    }

    return res.json({
      success: true,
      roundReward: out.roundRewardGranted ? ROUND_COMPLETION_REWARD_COINS : 0,
      giftBonus: out.giftBonusGranted ? ROUND_THREE_GIFT_BONUS_COINS : 0,
      giftClueGranted: out.giftBonusGranted,
      bonus: out.bonusGranted ? LEVEL_BLOCK_BONUS : 0,
      bonusGranted: out.bonusGranted,
      spinAvailable: out.isMilestone,
      ...out.wallet,
    });
  } catch (err) {
    return fail(res, err);
  }
};

/* ---------- GET /coins/spin/config ---------- */
exports.spinConfig = (req, res) => {
  res.json({ success: true, segments: SPIN_SEGMENTS.map(publicSegment) });
};

/* ---------- POST /coins/spin  { playerName, roundId, level } ----------
   One Lucky Spin per 5-level block. The server picks the prize. */
exports.spin = async (req, res) => {
  try {
    const { playerName, roundId, level } = req.body || {};
    const lvl = Number(level);
    if (!playerName || !lvl) return bad(res, "playerName and level required");
    if (lvl % LEVEL_BLOCK_SIZE !== 0) return bad(res, `Spin unlocks every ${LEVEL_BLOCK_SIZE} rounds`);

    const refKey = `spin:block:${lvl / LEVEL_BLOCK_SIZE}`;
    const rolled = pickSpinSegment();

    const out = await withTx(async (conn) => {
      await lockWallet(conn, playerName);

      const [ins] = await conn.query(
        `INSERT IGNORE INTO ws_coin_transactions (player_name, type, amount, round_id, level, ref_key, note)
         VALUES (?, 'spin', ?, ?, ?, ?, ?)`,
        [playerName, rolled.type === "coins" ? rolled.amount : 0, roundId != null ? String(roundId) : null, lvl, refKey, rolled.id]
      );

      // Already spun this block -> show the prize they got last time, pay nothing.
      if (ins.affectedRows === 0) {
        const [prev] = await conn.query(
          "SELECT note FROM ws_coin_transactions WHERE player_name = ? AND ref_key = ?",
          [playerName, refKey]
        );
        const old = SPIN_SEGMENTS.find((s) => s.id === prev[0]?.note) || rolled;
        return { already: true, seg: old, wallet: await snapshot(conn, playerName) };
      }

      if (rolled.type === "coins") {
        await conn.query("UPDATE ws_player_wallet SET coins = coins + ? WHERE player_name = ?", [rolled.amount, playerName]);
      } else if (rolled.type === "hints") {
        await conn.query("UPDATE ws_player_wallet SET hint_tokens = hint_tokens + ? WHERE player_name = ?", [rolled.amount, playerName]);
      } else if (rolled.type === "time") {
        await conn.query("UPDATE ws_player_wallet SET bonus_seconds = bonus_seconds + ? WHERE player_name = ?", [rolled.amount, playerName]);
      }
      return { already: false, seg: rolled, wallet: await snapshot(conn, playerName) };
    });

    return res.json({
      success: true,
      alreadySpun: out.already,
      segmentIndex: SPIN_SEGMENTS.findIndex((s) => s.id === out.seg.id),
      prize: publicSegment(out.seg),
      ...out.wallet,
    });
  } catch (err) {
    return fail(res, err);
  }
};

/* ---------- POST /coins/time-boost  { playerName, roundId } ----------
   Called when a round starts. Hands over any banked bonus seconds and clears them. */
exports.timeBoost = async (req, res) => {
  try {
    const { playerName } = req.body || {};
    if (!playerName) return bad(res, "playerName required");

    const out = await withTx(async (conn) => {
      await lockWallet(conn, playerName);
      const before = await snapshot(conn, playerName);
      if (before.bonusSeconds > 0) {
        await conn.query("UPDATE ws_player_wallet SET bonus_seconds = 0 WHERE player_name = ?", [playerName]);
      }
      return { seconds: before.bonusSeconds, wallet: await snapshot(conn, playerName) };
    });

    return res.json({ success: true, seconds: out.seconds, ...out.wallet });
  } catch (err) {
    return fail(res, err);
  }
};