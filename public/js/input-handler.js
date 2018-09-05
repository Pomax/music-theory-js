import { Keyboard } from "./keyboard.js";
import { GainKnob } from "./knob.js";
import { DrawBars } from "./drawbars.js";
import { OP } from "./midi-codes.js";
import { KNOBS } from "./arturia-minilab.js";
import { Arranger } from "./arranger/arranger.js";
class InputHandler {

  constructor(top) {
    // master audio context
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // master volume control
    this.masterVolumeKnob = new GainKnob(top, this.audioCtx, "volume", 0.2);

    // draw bars
    this.drawbars = new DrawBars(top, this.audioCtx, this.masterVolumeKnob.node);

    // keyboard visualisation
    this.keyboard = new Keyboard(this, top);

    // key source tracking
    this.generators = {};

    // add a composer so we can do nice music things
    this.arranger = new Arranger(this, document.getElementById('arranger'));

  }

  handle(command, note, velocity) {
    console.log(command, note, velocity);
    let drawbars = this.drawbars;

    if (OP[command] === "keyDown" && velocity > 0) {
        this.press(note, velocity);
    }

    else if (OP[command] === "keyUp") {
        this.release(note);
    }

    else if (OP[command] === "knob") {
        this.handleKnobs(note, velocity);
    }
  }

  press(note, velocity, delay=0) {
    this.playNote(note, velocity, delay);
    this.arranger.press(note, velocity);
  }

  // must return a stop() function
  playNote(note, velocity, delay=0) {
    if (velocity === 0) return ()=>{};

    let source = this.generators[note] = this.drawbars.getSound(note, velocity);
    setTimeout(() => {
      source.start();
      this.keyboard.press(note, velocity);
    }, delay);

    return () => this.release(note);
  }

  release(note) {
    if (this.generators[note]) {
        this.generators[note].stop();
        this.keyboard.release(note);
    }
  }

  handleKnobs(note, velocity) {
    let controls = this.drawbars;

    if      (KNOBS[note] === "c1")  { this.masterVolumeKnob.adjust(velocity); }
    else if (KNOBS[note] === "c2")  { controls.adjustLFOSpeed(velocity); }
    else if (KNOBS[note] === "c3")  { controls.adjustLFOStrength(velocity); }

    else if (KNOBS[note] === "c9")  { controls.adjust(0, velocity); }
    else if (KNOBS[note] === "c10") { controls.adjust(1, velocity); }
    else if (KNOBS[note] === "c11") { controls.adjust(2, velocity); }
    else if (KNOBS[note] === "c12") { controls.adjust(3, velocity); }
    else if (KNOBS[note] === "c13") { controls.adjust(4, velocity); }
    else if (KNOBS[note] === "c14") { controls.adjust(5, velocity); }
    else if (KNOBS[note] === "c15") { controls.adjust(6, velocity); }
    else if (KNOBS[note] === "c16") { controls.adjust(7, velocity); }
  }
}

export { InputHandler };
