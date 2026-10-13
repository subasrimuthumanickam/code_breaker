// Wheel la irukkura 8 slices (ithe order thaan frontend wheel la varum).
// weight = percentage. Total = 100.
const SPIN_REWARDS = [
  { id: 'coins_15', type: 'coins', amount: 15,  label: '15',      sub: '+15 coins',  icon: '🪙', weight: 28 },
  { id: 'hint_1',   type: 'hint',  amount: 1,   label: '1 Hint',  sub: '1 free hint', icon: '💡', weight: 16 },
  { id: 'coins_25', type: 'coins', amount: 25,  label: '25',      sub: '+25 coins',  icon: '🪙', weight: 20 },
  { id: 'time_20',  type: 'time',  amount: 20,  label: '+20s',    sub: 'Next round-la 20 sec extra', icon: '⏱️', weight: 12 },
  { id: 'coins_50', type: 'coins', amount: 50,  label: '50',      sub: '+50 coins',  icon: '🪙', weight: 10 },
  { id: 'hint_3',   type: 'hint',  amount: 3,   label: '3 Hints', sub: '3 free hints', icon: '💡', weight: 8 },
  { id: 'jackpot',  type: 'coins', amount: 100, label: 'JACKPOT', sub: '+100 coins', icon: '💎', weight: 3 },
  { id: 'time_45',  type: 'time',  amount: 45,  label: '+45s',    sub: 'Next round-la 45 sec extra', icon: '⏱️', weight: 3 },
];

module.exports = { SPIN_REWARDS, ROUNDS_REQUIRED_FOR_SPIN: 5 };