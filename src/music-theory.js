import { CHORDS } from "./chords.js";
import { MODES } from "./chords.js";
import { TONICS } from "./tonics.js";
import { NOTES, OCTAVES } from "./MIDI.js";
import { CIRCLE } from "./circle.js";

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

export default {
  notes,
  octaves,
  nameToNumber,

  modes: MODES,
  mode: (note, mode) => MODES[mode].map(offset(nameToNumber(note))),

  tonics: TONICS,
  tonic: (note, number) => TONICS.map(offset(nameToNumber(note)))[number],

  chords: CHORDS,
  invert,
  chord: (note, type, inversion=0) => invert(CHORDS[type].map(offset(nameToNumber(note))), inversion),
};
