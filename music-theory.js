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

const TONICS = [0].concat(MODES.ionian);

const TONIC_OFFSETS = {
    'i': 1,
    'I': 1,
    'ii': 2,
    'II': 2,
    'iii': 3,
    'III': 3,
    'iv': 4,
    'IV': 4,
    'v': 5,
    'V': 5,
    'vi': 6,
    'VI': 6,
    'vii': 7,
    'VII': 7
};

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
        'F#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'], // = Gb
        'C#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] // = Db
    },

    flats: {
        'C' :    [],
        'F' : ['Bb'],
        'Bb': ['Bb', 'Eb'],
        'Eb': ['Bb', 'Eb', 'Ab'],
        'Ab': ['Bb', 'Eb', 'Ab', 'Db'],
        'Db': ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
        'Gb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'], // = F#
        'Cb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] // = B
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
  if (!name) return -1;
  if (name == name<<0) return name;
  if (typeof name === 'function') return name;
  let note, octave;
  name.replace(/(\D+)(\d+)/, function(_, n, o) {
    note = n.toUpperCase();
    octave = o;
  });
  return NOTES[note] + OCTAVES[octave];
}

function invertCluster(notes, shift) {
  if (!shift) return notes;

  if (shift < 0) {
    while(shift++ < 0) {
      notes.unshift(notes.pop() - 12);
    }
    return notes;
  }

  if (shift > 0) {
    while(shift-- > 0) {
      notes.push(notes.shift() + 12);
    }
    return notes;
  }

  return notes;
}

const base = {
  notes: NOTES,
  octaves: OCTAVES,
  nameToNumber,

  modes: MODES,
  mode: (note, mode) => MODES[mode].map(offset(nameToNumber(note))),

  tonics: TONICS,
  getTonicOffset: v => TONICS[TONIC_OFFSETS[v]],
  tonic: (note, number) => TONICS.map(offset(nameToNumber(note)))[number],

  chords: CHORDS,
  invert: invertCluster,
  chord: (note, type, inversion=0) => invertCluster(CHORDS[type].map(offset(nameToNumber(note))), inversion),

  circle: CIRCLE
};

class Element {
  constructor(input) {
    if (!input.forEach) {
      input = [input];
    }
    this.cluster = input.map(v => (typeof v === "Number") ? v : nameToNumber(v)).filter(v => 0<=v && v<=127);
    this.inversion = 0;
  }
  root() {
    let len = this.cluster.length,
        ridx = (this.inversion + len) % len;
    return this.cluster[ridx];
  }
  chord(type, inversion) {
    let root = this.root();
    let notes = invertCluster(CHORDS[type].map(offset(nameToNumber(root))), inversion);
    let chord  =  new Element(notes);
    chord.type = type;
    if (inversion) {
      chord.inversion = inversion;
    }
    return chord;
  }
  invert(step) {
    let notes = this.cluster.slice();
    step = step % notes.length;

    if (step === 0) {
      return new Element(notes);
    }

    notes = invertCluster(notes, step);
    let inversion = new Element(notes);
    inversion.inversion = step;
    return inversion;
  }
  shift(delta=0) {
    return new Element(this.cluster.map(v => v + delta));
  }
  fifthUp() {
    return this.shift(+7);
  }
  fifthDown() {
    return this.shift(-7);
  }
  octaveUp() {
    return this.shift(+12);
  }
  octaveDown() {
    return this.shift(-12);
  }
  tonic(tone) {
    let minor = (tone.toUpperCase() !== tone);
    let delta = TONICS[TONIC_OFFSETS[tone]];
    let e = new Element(this.cluster.map(v => v + delta));
    if (minor) { e = e.minor(); }
    return e;
  }
  major() {
    let root = this.root();
    let base = (root+3) % 12;
    let notes = this.cluster.map(v => (v%12 === base)? v + 1 : v);
    return new Element(notes);
  }
  minor() {
    let root = this.root();
    let base = (root+4) % 12;
    let notes = this.cluster.map(v => (v%12 === base)? v - 1 : v);
    return new Element(notes);
  }
  add(...notes) {
    notes = notes.map(v => {
      let root = this.root();

      // flat/sharp/pure?
      let prefix = 0;
      if (typeof v === 'string') {
        if (v.indexOf('#') === 0) { prefix = +1; }
        if (v.indexOf('b') === 0) { prefix = -1; }
        v = v.substring(1);
      }

      // map to key offset
      v = parseFloat(v);
      let octave = (v/8)|0;
      let tone = v < 8 ? v : 1 + v%8;
      return root + 12 * octave + TONICS[tone] + prefix;
    });
    let uniques = {};
    this.cluster.concat(notes).forEach(v => (uniques[v]=1));
    notes = Object.keys(uniques).map(v => parseFloat(v)).sort((a,b) => a-b);
    return new Element(notes);
  }
}

if (typeof window !== "undefined" && window.DEBUG) {
  window.Element = Element;

  Element.prototype._play = function(duration=500) {
    let router = window.MIDIrouter;
    let stop = () => {
      this.cluster.forEach(v => router.signalnoteoff(0, v, 0));
    };
    this.cluster.forEach(v => router.signalnoteon(0, v, 64));
    setTimeout(stop, duration);
  };

  window.Theory = base;
}

export default base;
