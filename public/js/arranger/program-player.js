import Theory from "../theory.js";
import { Ticker } from "./ticker.js";
import { INTERVALS } from "./intervals.js";

/**
 *
 */
class ProgramPlayer {
  constructor(arranger, BMP) {
    this.arranger = arranger;
    this.ticker = new Ticker(this, BMP);
    this.intervals = INTERVALS;
    this.step = this.getDummyStep()
    this.program = [this.step];
    this.reset();
  }

  setBPM(bpm) {
    let tickDifference = this.ticker.setBPM(bpm);
    this.program.forEach(step => {
      step.end += tickDifference;
    });
  }

  setProgram(program) {
    this.program = program;
  }

  reset() {
    this.stepCounter = 0;
  }

  // TODO: make steps a real object.
  getDummyStep() {
    return makeStep({ note: 'C3', duration: 4 });
  }

  play() { this.ticker.play(); }
  stop() { this.ticker.stop(); this.cleanup(); }

  tick(tickCount) {
    if (this.step.end <= tickCount) {
      this.playProgramStep(tickCount);
    }
  }

  playProgramStep(tickCount) {
    this.currentTickCount = tickCount;

    // Integer BPM is virtually guaranteed to require
    // fractional millisecond timeouts, which we can't
    // work with in JavaScript. Instead, we need to check
    // if we 'skipped over' a tick to the one after, and
    // in those cases, correct the play length for the
    // next step by that many ticks.
    //
    // Note that without an external sync, there will
    // still be small amounts of drift if you're playing
    // this with a real metronome next to it.
    let correction = this.stopPreviousStep(tickCount);
    this.setNextStep();
    let step = this.step;
    step.end = tickCount + step.duration - correction;
    this.playStep(step);
  }

  updateStepForTonic(step, prev) {
    step.note = prev.note;
    step.notes = prev.notes;
    step.velocity = prev.velocity;
    // correct for octave and inversion
    step.notes = step.notes.map(v => v + step.octave);
    step.notes = Theory.invert(step.notes, step.inversion);
  }

  playStep(step) {
    // are we tonic-varying?
    if (step.note === -1 && step.tonic > 1) {
      this.updateStepForTonic(step, this.prevStep);
    }

    let notes = step.notes || [],
        velocity = step.velocity,
        arp = step.arp || 0,
        stops;

    // Make sure we're not updating the notes in the actual step itself.
    notes = notes.slice();

    // dynamic note generator?
    if(typeof step.note === 'function') {
      notes = step.note(step) || [];
    }

    // string -> array of notes
    if (!notes.forEach) {
      notes = [notes];
    }

    // additional custom notes?
    if (step.additional) {
      notes = notes.concat(step.additional);
    }

    // alternate tonic?
    if (step.tonic) {
      notes = notes.map(n => n + step.tonic);
      if (step.minor) {
        // adjust any major-third-on-root to minor.
        let root = notes[-step.inversion];
        let majorTriad = root + 4;
        for(let i=-8; i<9; i++) {
          let chk = majorTriad + (i * 12);
          if (chk < 0 || chk > 127) continue;
          let pos = notes.indexOf(chk);
          if (pos>-1) { notes[pos]--; }
        }
      }
    }

    // octave'd?
    if (step.octave) {
      notes = notes.map(n => n + step.octave);
    }

    // play all notes at the same time:
    if (!arp) {
      stops = notes.map(note => this.arranger.playNote(note, velocity));
    }

    // play notes staggered:
    else {
      let delay = 0;
      stops = notes.map(note => {
        let stop = this.arranger.playNote(note, velocity, delay);
        delay += arp;
        return stop;
      });
    }

    // ensure the step has a .stop() function that will
    // allow us to cancel it either naturally or prematurely.
    step.stop = () => stops.forEach(s => s());
  }

  cleanup() {
    if (this.step) {
      this.step.stop();
    }
    this.program.forEach(s => (s.end=0));
    this.reset();
  }

  stopPreviousStep(tickCount) {
    this.step.stop();
    return tickCount - this.step.end;
  }

  peekPrevStep() {
    let len = this.program.length;
  }

  setNextStep() {
    this.prevStep = this.step;
    this.step = this.program[this.stepCounter];
    this.step.stepCount = this.stepCounter;
    this.arranger.markStep(this.step.stepCount);
    this.stepCounter++;
    if (this.stepCounter >= this.program.length) { this.stepCounter = 0; }
  }
};

function makeStep(options) {
  options.originalNote = options.note;

  // rewrite whole, half, quarter, etc to tick count
  options.duration = INTERVALS[options.duration];

  let note = options.note = Theory.nameToNumber(options.note);

  if (note && !options.notes) {
    options.notes = [note];
  }

  if (options.chord) {
    let root = options.root = options.note;
    options.notes = Theory.chord(root, options.chord, options.inversion);
  }

  if (options.additional) {
    options.additional = options.additional.map(Theory.nameToNumber);
  }

  if (options.tonic) {
    options.minor = (options.tonic.toUpperCase() !== options.tonic);
    options.tonic = Theory.getTonicOffset(options.tonic);
  }

  if (options.octave) {
    options.octave = 12 * options.octave;
  }

  if (!options.end) { options.end = 0; }
  if (!options.stop) { options.stop = () => {}; }
  if (typeof options.velocity === "undefined") { options.velocity = 64; }

  console.log(options);

  return options;
}

ProgramPlayer.makeStep = makeStep;

function makeRest(duration=0) {
  return { note: false, duration };
}

ProgramPlayer.makeRest = makeRest;


export { ProgramPlayer };
