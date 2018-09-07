import { Keyboard } from "./keyboard.js";
import { GainKnob } from "./ui/knob.js";
import { DrawBars } from "./drawbars.js";
import { code } from "../router/midi-codes.js";

/**
 *
 */
class Synth {

  constructor(router, top) {

    router.addListener(this, "noteon");
    router.addListener(this, "noteoff");
    router.addListener(this, "control");

    // master audio context
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // master volume control
    this.masterVolumeKnob = new GainKnob(top, this.audioCtx, "volume", 0.2);

    // key source tracking
    this.generators = {};

    // draw bars
    this.drawbars = new DrawBars(router, top, this.audioCtx, this.masterVolumeKnob.node);

    // keyboard visualisation
    this.keyboard = new Keyboard(router, top);
  }

  onNoteOn(note, velocity) {
    this.playNote(note, velocity);
  }

  onNoteOff(note, velocity) {
    this.stopNote(note, velocity);
  }

  onControl(controller, value) {
    this.handleController(controller, value);
  }

  playNote(note, velocity, delay=0) {
    if (velocity === 0) return ()=>{};
    let source = this.generators[note] = this.drawbars.getSound(note, velocity);
    source.start();
  }

  stopNote(note) {
    if (this.generators[note]) {
        this.generators[note].stop();
    }
  }

  handleController(controller, value) {
    if (controller === code('Volume (coarse)'))  {
      this.masterVolumeKnob.setValue(value/127);
    }
  }
}

export { Synth };
