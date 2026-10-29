/* =========================================================
   LEVEL 25 DATA  -  "Save Tung Tung Tung Sahur from the police!"
   Used by routes/Braintwistlevel25routes.js
   Put this file in:  data/level25Db.js
========================================================= */

module.exports = {
  // question shown on the screen
  title: 'Save Tung Tung Tung Sahur from the police!',

  // free clue shown when the magnifier is pressed
  clue:
    'Sahur is stuck on the roof and the police van is watching. Think about where the van should go so he can slip away!',

  // the answer: drag the police van beside the door of Sahur's house (the left one)
  // targets on the screen: 'door_left' (Sahur's house) and 'door_right' (the other house)
  answerItem: 'van',
  answerTarget: 'door_left',

  // messages
  rightMsg: 'Yes! The van moved away from the door and Sahur escaped!',
  wrongMsgs: [
    'Not quite. Try again!',
    'Look at the roof. Where is Sahur?',
    'Move the van next to the door of his house.',
  ],
  wrongRightDoor: 'Sahur is not over there. Look at the roof of the other house!',
};