import { h, render } from '../preact.js';

import { Keyboard } from "./keyboard.js";
import { DrawBars } from "./drawbars.js";
import { code } from "../shared/midi-codes.js";
import { LabelBar } from "./label-bar.js";
import { router } from "../router/router.js";
import { context, masterGain } from "../shared/audio-context.js";

const volumeCode = code('Volume (coarse)');

/**
 *
 */
class Synth {

  constructor(top, startVolume) {
    router.addListener(this, "noteon");
    router.addListener(this, "noteoff");
    router.addListener(this, "control");

    // master volume control
    let master = this.masterVolume = {
      node: masterGain,
      value: startVolume || 0.5,
      label: "volume",
      setValue: v => {
        this.masterVolume.node.gain = v;
      }
    };
    masterGain.gain.value = master.value;

    // Right now we only have one {CC => control}
    // binding, but we still need a controller
    // for attack, delay, LFO frequency, and LFO
    // strength.
    this.controllers = [];

    // Add the master volume to the controller list.
    this.controllers[volumeCode] = this.masterVolume;
    this.masterVolume.ui = new LabelBar(
      {
        list: this.controllers,
        onSetValue: (bar, value) => {
          this.masterVolume.node.gain.value = value;
        }
      },
      this.masterVolume,
      top
    );

    // active audio source tracking
    this.generators = {};

    // drawbars
    render(h(DrawBars, {
      ref: e => (this.drawbars = e),
      out: masterGain,
      attack: 0.020,
      decay: 0.020
    }), top);

    // keyboard visualisation
    this.keyboard = new Keyboard(top);
  }

  onNoteOn(note, velocity) {
    this.playNote(note, velocity);
  }

  playNote(note, velocity, delay=0) {
    if (velocity === 0) return ()=>{};
    let active = this.generators[note];
    if (active) { active.stop(); }
    active = this.generators[note] = this.drawbars.getSource(note, velocity);
    active.start();
  }

  onNoteOff(note, velocity) {
    this.stopNote(note, velocity);
  }

  stopNote(note) {
    let active = this.generators[note];
    if (active) {
      active.stop();
      this.generators[note] = false;
    }
  }

  onControl(controller, value) {
    this.handleController(controller, value);
  }

  handleController(controller, value) {
    let cc = this.controllers[controller];
    if (cc) {
      cc.setValue(value/127);
    }
  }
}

export { Synth };
