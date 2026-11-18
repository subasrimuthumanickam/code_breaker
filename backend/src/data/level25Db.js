

module.exports = {
  // question shown on the screen
  title: 'Save Tung Tung Tung Sahur from the police!',

  // free hint shown when the magnifier is pressed
  clue: 'Move the house door closer to the police van.',

  // the answer: the left house door (Sahur's house) is dropped beside the police van
  // targets on the screen: 'door_left' (Sahur's house) and 'door_right' (the other house)
  answerItem: 'van',
  answerTarget: 'door_left',

  // messages
  rightMsg: 'Yes! The van moved away from the door and Sahur escaped!',
  wrongMsgs: [
    'Not quite. Try again!',
    'Look at the roof. Where is Sahur?',
    'Move the house door next to the police van.',
  ],
  wrongRightDoor: 'Sahur is not over there. Look at the roof of the other house!',
};