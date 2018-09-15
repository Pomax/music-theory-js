import { Ticker } from "../shared/ticker.js";
import { INTERVALS } from "../shared/intervals.js";

/**
 *
 */
class ProgramPlayer {
  constructor(arranger, BMP) {
    this.arranger = arranger;

    this.ticker = Ticker.getMaster(this);
    this.ticker.setBPM(BMP);

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

  tickStarted() {}

  stop() { this.ticker.stop(); this.cleanup(); }

  tickStopped() {}


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

  /**
   *
   * @param {*} step
   * @param {*} prev
   */
  updateStepForTonic(step, prev) {
    let e = prev.from ? prev.from : prev.element;
    step.element = e.tonic(step.tonic);
    step.from = e;

    if (step.chord) {
      step.element = step.element.chord(step.chord);
    }

    if (step.minor) {
      step.element = step.element.minor();
    } else {
      step.element = step.element.major();
    }

    if (step.inversion) {
      step.element = step.element.invert(step.inversion);
    }
    if (step.octave) {
      step.element = step.element.changeOctave(step.octave);
    }

    step.velocity = prev.velocity;
  }

  /**
   *
   * @param {*} step
   */
  playStep(step) {
    // are we tonic-varying?
    if (step.note === false && step.tonic) {
      this.updateStepForTonic(step, this.prevStep);
    }

    let element = step.element,
        velocity = step.velocity,
        arp = step.arp || 0,
        stops = [];

    // play all notes at the same time:
    if (!arp) {
      stops = element.cluster.map(note => this.arranger.playNote(note, velocity));
    }

    // play notes staggered:
    else {
      let delay = 0;
      stops = element.cluster.map(note => {
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
  let e = new Element(options.note);

  if (options.chord) {
    e = e.chord(options.chord);
  }

  if (options.additional) {
    e = e.add(...options.additional);
  }

  if (options.inversion) {
    e = e.invert(options.inversion);
  }

  if (options.octave) {
    e = e.changeOctave(options.octave);
  }

  if (options.tonic) {
    e = e.tonic(options.tonic);
    if (options.tonic.toUpperCase() !== options.tonic) {
      e = e.minor();
      options.minor = true;
    }
  }

  // rewrite whole, half, quarter, etc to tick count
  options.duration = INTERVALS[options.duration];
  options.end = options.end || 0;
  options.stop = options.stop || (() => {});
  options.velocity = (typeof options.velocity === "undefined") ? 64 : options.velocity;

  options.element = e;

  return options;
}

ProgramPlayer.makeStep = makeStep;

function makeRest(duration=0) {
  let e = new Element(false);
  e.duration = duration;
  return e;
}

ProgramPlayer.makeRest = makeRest;


export { ProgramPlayer };
