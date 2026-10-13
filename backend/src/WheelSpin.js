const mongoose = require('mongoose');

// Oru spin record. (playerId + sessionId) unique => 5 rounds ku oru spin mattum.
const wheelSpinSchema = new mongoose.Schema(
  {
    playerId:   { type: String, required: true, index: true },
    sessionId:  { type: String, required: true },
    prizeIndex: { type: Number, required: true },
    rewardId:   { type: String, required: true },
    rewardType: { type: String, enum: ['coins', 'hint', 'time'], required: true },
    amount:     { type: Number, required: true },
  },
  { timestamps: true }
);
wheelSpinSchema.index({ playerId: 1, sessionId: 1 }, { unique: true });

// Reward-a store panra wallet. Ungalukku already profile/coins model irundha
// ithai athula merge pannikalam (coins, hints, bonusSeconds fields add pannaa pothum).
const walletSchema = new mongoose.Schema({
  playerId:     { type: String, required: true, unique: true },
  coins:        { type: Number, default: 0 },
  hints:        { type: Number, default: 0 },
  bonusSeconds: { type: Number, default: 0 }, // next round la use aagum
});

module.exports = {
  WheelSpin: mongoose.models.WheelSpin || mongoose.model('WheelSpin', wheelSpinSchema),
  Wallet:    mongoose.models.Wallet    || mongoose.model('Wallet', walletSchema),
};