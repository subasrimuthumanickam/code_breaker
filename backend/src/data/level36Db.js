
const players = new Map();

const START_HINTS = 100;

function getPlayer(playerId) {
  const id = String(playerId);
  if (!players.has(id)) {
    players.set(id, { hints: START_HINTS, attempts: 0, hintsUsed: 0, solved: false });
  }
  return players.get(id);
}

function spendHints(playerId, cost) {
  const p = getPlayer(playerId);
  if (p.hints < cost) return false;
  p.hints -= cost;
  return true;
}

function addHints(playerId, amount) {
  const p = getPlayer(playerId);
  p.hints += amount;
  return p.hints;
}

function addAttempt(playerId) {
  const p = getPlayer(playerId);
  p.attempts += 1;
  return p.attempts;
}

function nextHintIndex(playerId) {
  const p = getPlayer(playerId);
  const i = p.hintsUsed;
  p.hintsUsed += 1;
  return i;
}

function markSolved(playerId) {
  getPlayer(playerId).solved = true;
}

module.exports = {
  getPlayer,
  spendHints,
  addHints,
  addAttempt,
  nextHintIndex,
  markSolved,
};