// "Don't worry about it, it's just a straight I-VI-II-IV".

// offset so that I maps to [1], and ditch
// the VIII because that's just the I
const TONICS = [0].concat(modes.ionian.slice(0,7));

export { TONICS };
