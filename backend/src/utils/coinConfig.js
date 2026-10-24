

const ROUND_COMPLETION_REWARD_COINS = 10;
const ROUND_THREE_GIFT_BONUS_COINS = 20;

const HINT_COST = 5; // coins spent per hint / clue use

const LEVEL_BLOCK_SIZE = 5; // every 5 rounds completed...
const LEVEL_BLOCK_BONUS = 30; // ...pays coins

/*
  Lucky Spin (after every 5th level). The SERVER picks the prize by weight,
  the app only animates the wheel to that segment, so it can't be cheated.

  coins -> added to wallet
  time  -> "time boost": extra seconds added at the start of the NEXT round
*/
const SPIN_SEGMENTS = [
  { id: "c15", type: "coins", amount: 15, label: "15", emoji: "🪙", color: "#FF6B57", weight: 28 },
  { id: "c5", type: "coins", amount: 5, label: "5", emoji: "🪙", color: "#4F46E5", weight: 16 },
  { id: "c25", type: "coins", amount: 25, label: "25", emoji: "🪙", color: "#22B573", weight: 20 },
  { id: "t20", type: "time", amount: 20, label: "+20s", emoji: "⏱️", color: "#3B82F6", weight: 12 },
  { id: "c50", type: "coins", amount: 50, label: "50", emoji: "🪙", color: "#F2B640", weight: 10 },
  { id: "c15b", type: "coins", amount: 15, label: "15", emoji: "🪙", color: "#F0566A", weight: 8 },
  { id: "c100", type: "coins", amount: 100, label: "JACKPOT", emoji: "💎", color: "#8B5CF6", weight: 3 },
  { id: "t45", type: "time", amount: 45, label: "+45s", emoji: "⏱️", color: "#14B8A6", weight: 3 },
];

const pickSpinSegment = () => {
  const total = SPIN_SEGMENTS.reduce((s, x) => s + x.weight, 0);
  let roll = Math.random() * total;
  for (const seg of SPIN_SEGMENTS) {
    roll -= seg.weight;
    if (roll < 0) return seg;
  }
  return SPIN_SEGMENTS[0];
};

module.exports = {
  ROUND_COMPLETION_REWARD_COINS,
  ROUND_THREE_GIFT_BONUS_COINS,
  HINT_COST,
  LEVEL_BLOCK_SIZE,
  LEVEL_BLOCK_BONUS,
  SPIN_SEGMENTS,
  pickSpinSegment,
};