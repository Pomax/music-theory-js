// "Don't worry about it, it's just a straight I-VI-II-IV".
import { MODES } from "./modes.js";

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

const TONIC_NAMES = {
    tonic: 0,
    supertonic: 2,
    mediant: 4,
    subdominant: 5,
    dominant: 7,
    submediant: 9,
    leading: 11,
    octave: 12
}

export { TONICS, TONIC_OFFSETS };
