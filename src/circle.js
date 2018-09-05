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

export { CIRCLE };
