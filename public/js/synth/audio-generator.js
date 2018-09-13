import { AudioSource } from './audio-source.js';

class AudioGenerator {

    constructor(context, lfoFrequency, lfoStrength) {
        this.context = context;

        if (lfoFrequency && lfoStrength) {
            this.lfoFrequency = lfoFrequency;
            this.lfoStrength = lfoStrength;
            this.setupLFO();
        }
    }

    setupLFO() {
        // set up the low frequency oscillator
        let LFO = this.context.createOscillator();
        LFO.type = "sine";
        LFO.frequency.value = this.lfoFrequency;
        this.lfo = LFO;

        // and hook it up to its own gain
        var LFOGain = this.context.createGain();
        LFOGain.gain.value = this.lfoStrength;
        this.lfoGain = LFOGain;

        // hook it up and start the LFO
        LFO.connect(LFOGain);
        LFO.start();
    }

    setLFOFrequency(v) {
        this.lfoFrequency = v;
        this.lfo.frequency.value = v;
    }

    setLFOStrength(v) {
        this.lfoStrength = v;
        this.lfoGain.gain.value = v;
    }

    get(master, type, note) {
        return new AudioSource(this.context, master, type, note, this.lfoGain);
    }
}

export { AudioGenerator };
