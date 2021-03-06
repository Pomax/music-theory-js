// The tools we use to harmonize music.

const CHORDS = {
   minor: [0,3,7],
     dim: [0,3,6],
   major: [0,4,7],
     aug: [0,4,8],

    sus2: [0,2,7],
    sus4: [0,5,7],
 '9sus4': [0,5,7,10,13],

      dim7: [0,3,6,9],
      min7: [0,3,7,10],
'mim-maj7': [0,3,7,11],
 'min7-b5': [0,3,6,10],
      dom7: [0,4,7,10],
      aug7: [0,4,8,10],
   augmaj7: [0,4,8,11],

'maj-6': [0,4,7,9],
'maj-7': [0,4,7,11],
'maj-2': [0,4,7,14],
'maj-4': [0,4,7,17],
'maj-9': [0,4,7,10,14],
  '6/9': [0,4,7,9,14],  // hmm
  '7/6': [0,4,7,9,10],  // hmm v2
'min-9': [0,3,7,10,14],

'min-11': [0,3,7,10,14,17],
'maj-11': [0,4,7,10,14,17],
'min-13': [0,3,7,10,14,17,21],
'maj-13': [0,4,7,10,14,17,21],
};

export { CHORDS };
