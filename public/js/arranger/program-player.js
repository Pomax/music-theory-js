import Theory from "../music-theory.js";
import { Ticker } from "./ticker.js";
import { INTERVALS } from "./intervals.js";

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
    let step = this.getNextStep();
    if (step) {
      step.end = tickCount + step.duration - correction;
      this.currentStep = step;
      this.playStep(step);
    }
  }

  playStep(step) {
    this.arranger.markStep(step.stepCount);

    let notes = step.notes || [],
        velocity = step.velocity,
        duration = step.duration || 0,
        arp = step.arp || 0,
        stops;

    // dynamic not generator?
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

  setProgram(program) {
    this.program = program;
  }

  cleanup() {
    if (this.currentStep) {
      this.currentStep.stop();
    }
    this.program.forEach(s => (s.end=0));
    this.reset();
  }

  stopPreviousStep(tickCount) {
    this.step.stop();
    return tickCount - this.step.end;
  }

  getNextStep() {
    let len = this.program.length;
    this.step = this.program[this.stepCounter];
    this.step.stepCount = this.stepCounter++;
    if (this.stepCounter >= len) { this.stepCounter = 0; }
    return this.step;
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

  if (!options.end) { options.end = 0; }
  if (!options.stop) { options.stop = () => {}; }
  if (typeof options.velocity === "undefined") { options.velocity = 64; }

  return options;
}

ProgramPlayer.makeStep = makeStep;

function makeRest(duration=0) {
  return { note: false, duration };
}

ProgramPlayer.makeRest = makeRest;


export { ProgramPlayer };
