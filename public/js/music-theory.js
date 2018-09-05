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

// Those names you can never remember...

const MODES = {
    ionian:     [0,2,4,5,7,9,11,12],
    dorian:     [0,2,3,5,7,9,10,12],
    phrygian:   [0,1,3,5,7,8,10,12],
    lydian:     [0,2,4,6,7,9,11,12],
    mixolydian: [0,2,4,5,7,9,10,12],
    aeolian:    [0,2,3,5,7,8,10,12],
    locrian:    [0,1,3,5,6,8,10,12],
};

// "Don't worry about it, it's just a straight I-VI-II-IV".

const TONICS = [0].concat(MODES.ionian.slice(0,7));

// MIDI notes use numbers, which are inconvenient.

const NOTES = {
    'Cb': -1,
     'C':  0,
    'C#':  1,
    'Db':  1,
     'D':  2,
    'D#':  3,
    'Eb':  3,
     'E':  4,
    'E#':  5,
    'Fb':  4,
     'F':  5,
    'F#':  6,
    'Gb':  6,
     'G':  7,
    'G#':  8,
    'Ab':  8,
     'A':  9,
    'A#': 10,
    'Bb': 10,
     'B': 11,
    'B#': 12,
  };

  const OCTAVES = {
    '-1': 0,
     '0': 12,
     '1': 24,
     '2': 36,
     '3': 48,
     '4': 60,
     '5': 72,
     '6': 84,
     '7': 96,
     '8': 108,
     '9': 120,
  };

// Look everybody, it's the circle of fifths!

// The standard circle is the "major" circle
const CIRCLE = {
    sharps: {
        'C' : [],
        'G' : ['F#'],
        'D' : ['F#', 'C#'],
        'A' : ['F#', 'C#', 'G#'],
        'E' : ['F#', 'C#', 'G#', 'D#'],
        'B' : ['F#', 'C#', 'G#', 'D#', 'A#'],
        'F#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'],
        'C#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
    },

    flats: {
        'C' :    [],
        'F' : ['Bb'],
        'Bb': ['Bb', 'Eb'],
        'Eb': ['Bb', 'Eb', 'Ab'],
        'Ab': ['Bb', 'Eb', 'Ab', 'Db'],
        'Db': ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
        'Gb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],
        'Cb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']
    }
};

// but we want the "minor" circle, too.

CIRCLE.sharps['a']  = CIRCLE.sharps['C'];
CIRCLE.sharps['e']  = CIRCLE.sharps['G'];
CIRCLE.sharps['b']  = CIRCLE.sharps['D'];
CIRCLE.sharps['f#'] = CIRCLE.sharps['A'];
CIRCLE.sharps['c#'] = CIRCLE.sharps['E'];
CIRCLE.sharps['g#'] = CIRCLE.sharps['B'];
CIRCLE.sharps['d#'] = CIRCLE.sharps['F#'];
CIRCLE.sharps['a#'] = CIRCLE.sharps['C#'];

CIRCLE.flats['a']  = CIRCLE.flats['C'];
CIRCLE.flats['d']  = CIRCLE.flats['F'];
CIRCLE.flats['g']  = CIRCLE.flats['Bb'];
CIRCLE.flats['c']  = CIRCLE.flats['Eb'];
CIRCLE.flats['f']  = CIRCLE.flats['Ab'];
CIRCLE.flats['bb'] = CIRCLE.flats['Db'];
CIRCLE.flats['eb'] = CIRCLE.flats['Gb'];
CIRCLE.flats['ab'] = CIRCLE.flats['Cb'];

const offset = note => (v => note + v);

function nameToNumber(name) {
  if (name == name<<0) return name;
  if (typeof name === 'function') return name;
  let note, octave;
  name.replace(/(\D+)(\d+)/, function(_, n, o) {
    note = n;
    octave = o;
  });
  return NOTES[note] + OCTAVES[octave];
}

function invert(notes, shift) {
  if (!shift) return notes;

  if (shift < 0)  while(shift++ < 0) {
    notes.unshift(notes.pop() - 12);
  }

  if (shift > 0) while(shift-- > 0) {
    notes.push(notes.shift() + 12);
  }

  return notes;
}

var musicTheory = {
  notes: NOTES,
  octaves: OCTAVES,
  nameToNumber,

  modes: MODES,
  mode: (note, mode) => MODES[mode].map(offset(nameToNumber(note))),

  tonics: TONICS,
  tonic: (note, number) => TONICS.map(offset(nameToNumber(note)))[number],

  chords: CHORDS,
  invert,
  chord: (note, type, inversion=0) => invert(CHORDS[type].map(offset(nameToNumber(note))), inversion),

  circle: CIRCLE,
};

export default musicTheory;
