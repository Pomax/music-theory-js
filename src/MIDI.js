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
  }

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
  }

export {
  NOTES,
  OCTAVES
};
