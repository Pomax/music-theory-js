import { CHORDS } from "./chords.js";
import { MODES } from "./modes.js";
import { TONICS, TONIC_OFFSETS } from "./tonics.js";
import { NOTES, OCTAVES } from "./MIDI.js";
import { CIRCLE } from "./circle.js";

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
    let notes = invertCluster(CHORDS[type].map(offset(nameToNumber(root))), inversion)
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
    }
    this.cluster.forEach(v => router.signalnoteon(0, v, 64));
    setTimeout(stop, duration);
  }

  window.Theory = base;
}

export default base;