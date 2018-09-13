import { h, render } from '../preact.js';

import { AudioSource } from "./audio-source.js";
import { Keyboard } from "./keyboard.js";
import { DrawBars } from "./drawbars.js";
import { code } from "../router/midi-codes.js";
import { LabelBar } from "./jsx/label-bar.js";
import { router } from "../router/router.js";
import { setupAnalyser } from "./show-fft.js";

const volumeCode = code('Volume (coarse)');

/**
 *
 */
class Synth {

  constructor(top, startVolume) {
    router.addListener(this, "noteon");
    router.addListener(this, "noteoff");
    router.addListener(this, "control");

    // master audio context
    const context = this.context = new (window.AudioContext || window.webkitAudioContext)();

    // master volume control
    let masterGain = context.createGain();
    let master = this.masterVolume = {
      node: masterGain,
      value: startVolume || 0.5,
      label: "volume",
      setValue: v => {
        this.masterVolume.node.gain = v;
      }
    };
    masterGain.gain.value = master.value;

    // Hook up the master volume to the speakers,
    // and set up a visualiser, because they're cool.
    masterGain.connect(context.destination);
    setupAnalyser(context, masterGain);

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
      context: this.context,
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
    if (active) { active.stop(); }
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
