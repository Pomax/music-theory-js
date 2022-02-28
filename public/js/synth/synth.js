import { h, render } from "../preact.js";

import { Keyboard } from "./keyboard.js";
import { DrawBars } from "./drawbars.js";
import { code } from "../shared/midi-codes.js";
import { router } from "../router/router.js";
import { Slider } from "../shared/slider.js";
import { LFO } from "../shared/lfo.js";
import { masterGain } from "../shared/audio-context.js";
import { AudioSource } from "../shared/audio-source.js";

const volumeCode = code("Volume (coarse)");

/**
 *
 */
class Synth {
  constructor(top, startVolume) {
    router.addListener(this, "noteon");
    router.addListener(this, "noteoff");

    // master volume control
    masterGain.gain.value = startVolume || 0.5;
    let master = h(Slider, {
      ref: (e) => (master.api = e),
      label: "volume",
      value: masterGain.gain.value,
      onInput: (v) => (masterGain.gain.value = v),
      cc: volumeCode,
    });
    render(master, document.querySelector(`#master`));

    // set up an LFO, which we can use either
    // globally, or as LFO modulator for
    // each individual oscillator used.
    render(
      h(LFO, {
        ref: (e) => {
          let lfo = e.getOutput();
          AudioSource.setGlobalLFO(lfo);
        },
      }),
      document.querySelector(`#lfo`)
    );

    // active audio source tracking
    this.generators = {};

    // drawbars
    render(h(DrawBars, {
      ref: e => (this.drawbars = e),
      out: masterGain,
      attack: 0.020,
      decay: 0.020
    }), document.querySelector(`#drawbars`));

    // keyboard visualisation
    render(h(Keyboard, {
      ref: e => (this.keyboard = e)
    }), document.querySelector(`#keyboard`));

  }

  onNoteOn(note, velocity) {
    this.playNote(note, velocity);
  }

  playNote(note, velocity, delay = 0) {
    if (velocity === 0) return () => {};
    let active = this.generators[note];
    if (active) {
      active.stop();
    }
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
}

export { Synth };
