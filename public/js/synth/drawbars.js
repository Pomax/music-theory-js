import { getFrequency } from "./sounds.js";
import { GainKnob } from "./ui/knob.js";
import { router } from "../router/router.js";
import { code } from "../router/midi-codes.js";
import { LabelBar } from "./ui/label-bar.js";

const modes = {
    original: [-12, 0, 7, 12, 19, 26, 31, 38],
}

/**
 *
 */
class DrawBars {

    constructor(top, context, masterGain) {
        router.addListener(this, "control");

        this.context = context;
        this.masterGain = masterGain;

        this.setupLFO(top);

        this.normalizer = new GainKnob(top, context, "normalize", 1.0, masterGain);
        this.normalizer.style({ opacity: 0.3 });

        this.oscillators = {};

        this.attack = 0.015;
        this.decay = 0.035;

        this.mode = "original";
        this.bindDrawBars(top, context);
    }

    setupLFO(top) {
        var LFO = this.LFO = this.context.createOscillator();
        LFO.type = "sine";
        LFO.frequency.value = 3.0;

        var LFOGain = this.LFOGain = this.context.createGain();
        LFOGain.gain.value = 3.0;
        LFO.connect(LFOGain);
        LFO.start();

        this.renderLFOValues(top);
    }

    renderLFOValues(top) {
        let lfo = document.querySelector('.lfo-info');
        if (!lfo) {
          lfo = document.createElement("div");
          lfo.classList.add('lfo-info');
          top.appendChild(lfo);
        }
        const freq = this.LFO.frequency.value.toFixed(2);
        const str = this.LFOGain.gain.value.toFixed(2);
        if (freq < 0.1) {
            lfo.innerHTML = `LFO disabled`;
        } else {
            lfo.innerHTML = `LFO running: <span>${freq}</span> Hz, strength: <span>${str}</span>`;
        }
    }

    onControl(controller, value) {
        let bar = this.DRAW_BARS[controller];
        if (bar) bar.setValue(value / 127);
    }

    bindDrawBars(top, context) {
        let tones = modes[this.mode]
        let DRAW_BARS = this.DRAW_BARS = [];

        DRAW_BARS[code('General Purpose Slider 1')] = { offset: tones[0], node: context.createGain(), value: 0.4, label: "sub-octave" };
        DRAW_BARS[code('General Purpose Slider 2')] = { offset: tones[1], node: context.createGain(), value: 1.0, label: "primary"};
        DRAW_BARS[code('General Purpose Slider 3')] = { offset: tones[2], node: context.createGain(), value: 0.6, label: "quint"};
        DRAW_BARS[code('General Purpose Slider 4')] = { offset: tones[3], node: context.createGain(), value: 0.4, label: "octave"};
        DRAW_BARS[20] = { offset: tones[4], node: context.createGain(), value: 0.2, label: "harmony 1"};
        DRAW_BARS[21] = { offset: tones[5], node: context.createGain(), value: 0.1, label: "harmony 2"};
        DRAW_BARS[22] = { offset: tones[6], node: context.createGain(), value: 0.0, label: "harmony 3"};
        DRAW_BARS[23] = { offset: tones[7], node: context.createGain(), value: 0.0, label: "harmony 4"};

        this.bootstrap(top);
    }

    bootstrap(top) {
        if (this.container) {
            top.removeChild(this.container);
        }

        this.container = document.createElement("div");
        this.container.classList.add("drawbars");
        top.appendChild(this.container);

        this.DRAW_BARS.forEach(bar => this.setupDrawBar(bar));
        this.normalize();
    }

    setupDrawBar(bar) {
        bar.node.gain.value = bar.value;
        bar.ui = new LabelBar({
            list: this.DRAW_BARS,
            onSetValue: () => this.normalize()
        }, bar, this.container);
    }

    normalize() {
        let sum = this.DRAW_BARS.reduce( (tally, bar) => tally + bar.value, 0 );
        this.normalizer.setValue(1 / sum);
    }

    adjust(idx, v) {
        let bar = this.DRAW_BARS[idx];
        let step = 0.01 * (v===64 ? 0 : v-64);
        let volume = bar.value;
        volume += step;
        if (volume < 0) volume = 0;
        if (volume > 1) volume = 1;
        bar.setValue(volume);
    }

    adjustLFOSpeed(v) {
        let LFO = this.LFO;
        let freq = LFO.frequency.value;
        let step = 0.1 * (v===64 ? 0 : v-64);
        let speed = freq + step;
        if (speed < 0.0) { speed = 0.0; }
        LFO.frequency.value = speed;
        this.renderLFOValues();
    }

    adjustLFOStrength(v) {
        let LFO = this.LFOGain;
        let freq = LFO.gain.value;
        let step = 0.1 * (v===64 ? 0 : v-64);
        let strength = freq + step;
        if (strength < 0.1) { strength = 0.1; }
        LFO.gain.value = strength;
        this.renderLFOValues();
    }

    getSound(note, velocity) {
        // it kind of sucks that we can't just easily recycle these... =(
        var osc = this.DRAW_BARS.map(bar => this.getGenerator(note, velocity, bar));
        return {
            start: () => osc.forEach(o => o.start()),
            stop: () => osc.forEach(o => o.stop())
        };
    }

    getGenerator(note, velocity, bar) {
        var oscillators = this.oscillators;
        var mid = note + '.' + bar.offset;

        if (oscillators[mid]) {
            oscillators[mid].targetVelocity = velocity/127;
            return oscillators[mid];
        }

        // start at 0 volume
        var keyVolume = this.context.createGain();
        keyVolume.gain.value = 0;

        var oscillator = this.context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(getFrequency(note + bar.offset), this.context.currentTime);

        this.LFOGain.connect(oscillator.frequency);
        oscillator.connect(keyVolume);
        keyVolume.connect(bar.node)
        bar.node.connect(this.normalizer.node);

        // we don't actually turn oscillators on/off, we just adjust
        // their volume, so we start this oscillator immediately.
        oscillator.start();

        let osc = oscillators[mid] = {
            targetVelocity: velocity/127,
            start: () => {
                keyVolume.gain.value = 0;
                keyVolume.gain.setTargetAtTime(osc.targetVelocity, this.context.currentTime, this.attack);
            },
            stop: () => {
                keyVolume.gain.setTargetAtTime(0, this.context.currentTime, this.decay);
            }
        };

        return oscillators[mid];
    }

}

export { DrawBars }
