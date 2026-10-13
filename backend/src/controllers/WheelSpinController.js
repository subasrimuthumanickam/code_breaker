const crypto = require('crypto');
const { SPIN_REWARDS, ROUNDS_REQUIRED_FOR_SPIN } = require('../config/spinRewards');
const { WheelSpin, Wallet } = require('../models/WheelSpin');

// Server-side weighted random (client ku result decide panna chance illa)
function pickReward() {
  const total = SPIN_REWARDS.reduce((s, r) => s + r.weight, 0);
  let roll = crypto.randomInt(0, total * 100) / 100; // 0 .. total
  for (let i = 0; i < SPIN_REWARDS.length; i++) {
    roll -= SPIN_REWARDS[i].weight;
    if (roll < 0) return { reward: SPIN_REWARDS[i], index: i };
  }
  return { reward: SPIN_REWARDS[0], index: 0 };
}

// TODO: ithai ungal game session data ku connect pannunga.
// Ungal round-complete logic la session-ku ethana round mudinjuchu nu DB la
// irukkum; athai inga read pannunga. Client sollrathai nambakoodathu.
async function getRoundsCompleted(playerId, sessionId) {
  // example: const s = await GameSession.findOne({ _id: sessionId, playerId });
  //          return s ? s.roundsCompleted : 0;
  return ROUNDS_REQUIRED_FOR_SPIN; // dev only
}

const publicReward = (r) => ({ id: r.id, type: r.type, amount: r.amount, label: r.label, sub: r.sub, icon: r.icon });

// GET /api/spin/config  -> wheel slices (probabilities anupa maatom)
exports.getConfig = (req, res) => {
  res.json({ success: true, roundsRequired: ROUNDS_REQUIRED_FOR_SPIN, rewards: SPIN_REWARDS.map(publicReward) });
};

// POST /api/spin   body: { playerId, sessionId }
exports.spin = async (req, res) => {
  try {
    const playerId = req.user?.id || req.body.playerId; // auth irundha req.user use pannunga
    const { sessionId } = req.body;
    if (!playerId || !sessionId) {
      return res.status(400).json({ success: false, message: 'playerId and sessionId required' });
    }

    const rounds = await getRoundsCompleted(playerId, sessionId);
    if (rounds < ROUNDS_REQUIRED_FOR_SPIN) {
      return res.status(403).json({ success: false, message: `Complete ${ROUNDS_REQUIRED_FOR_SPIN} rounds to spin` });
    }

    const { reward, index } = pickReward();

    // Unique index -> double spin / double tap / replay attack block
    try {
      await WheelSpin.create({
        playerId, sessionId, prizeIndex: index,
        rewardId: reward.id, rewardType: reward.type, amount: reward.amount,
      });
    } catch (err) {
      if (err.code === 11000) {
        const prev = await WheelSpin.findOne({ playerId, sessionId });
        const r = SPIN_REWARDS[prev.prizeIndex];
        return res.status(409).json({
          success: false, message: 'Already spun for this session',
          prizeIndex: prev.prizeIndex, reward: publicReward(r),
        });
      }
      throw err;
    }

    const inc =
      reward.type === 'coins' ? { coins: reward.amount } :
      reward.type === 'hint'  ? { hints: reward.amount } :
                                { bonusSeconds: reward.amount };

    const wallet = await Wallet.findOneAndUpdate(
      { playerId }, { $inc: inc }, { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      prizeIndex: index,               // wheel enga nikkanum nu frontend ku
      reward: publicReward(reward),
      wallet: { coins: wallet.coins, hints: wallet.hints, bonusSeconds: wallet.bonusSeconds },
    });
  } catch (err) {
    console.error('spin error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/spin/consume-time  body: { playerId }
// Next round start aagumbodhu call pannunga -> bonus seconds kudukkum, 0 aakidum
exports.consumeBonusTime = async (req, res) => {
  try {
    const playerId = req.user?.id || req.body.playerId;
    const w = await Wallet.findOneAndUpdate({ playerId }, { $set: { bonusSeconds: 0 } }, { new: false });
    res.json({ success: true, bonusSeconds: w?.bonusSeconds || 0 });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};