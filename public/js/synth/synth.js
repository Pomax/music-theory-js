import { Keyboard } from "./keyboard.js";
import { DrawBars } from "./drawbars.js";
import { code } from "../router/midi-codes.js";
import { LabelBar } from "./ui/label-bar.js";
import { router } from "../router/router.js";

const volumeCode = code('Volume (coarse)');

/**
 *
 */
class Synth {

  constructor(top) {

    router.addListener(this, "noteon");
    router.addListener(this, "noteoff");
    router.addListener(this, "control");

    // master audio context
    const context = this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    this.masterVolume = {
      node: context.createGain(),
      value: 0.8,
      label: "volume",
      setValue: v => {
        this.masterVolume.node.gain = v;
      }
    };
    this.masterVolume.node.connect(context.destination);

    // At the top level we only have a single controller,
    // so it might seem a bit silly to use a full controller
    // list, but it keeps the rest of the code homogeneous.
    this.controllers = [];
    this.controllers[volumeCode] = this.masterVolume;
    this.masterVolume.ui = new LabelBar(
      {
        list: this.controllers,
        onSetValue: (bar, value) => {
          //this.masterVolume.node.value = value;
        }
      },
      this.masterVolume,
      top
    );

    //new GainKnob(top, this.audioCtx, "volume", 0.2);

    // key source tracking
    this.generators = {};

    // draw bars
    this.drawbars = new DrawBars(top, this.audioCtx, this.masterVolume.node);

    // keyboard visualisation
    this.keyboard = new Keyboard(top);
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
    let cc = this.controllers[controller];
    if (cc) {
      cc.setValue(value/127);
    }
  }
}

export { Synth };
