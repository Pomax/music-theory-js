import { getFrequency } from "./get-frequency.js";

class AudioSource {
    constructor(context, master, type, note, lfoGain) {
        this.context = context;
        this.type = type;
        this.note = note;

        // set up an oscillator.
        var oscillator = this.oscillator = context.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(getFrequency(note), context.currentTime);

        // we use a gain to control attack/decay
        var volume = this.volume = context.createGain();
        volume.gain.value = 0;

        if (lfoGain) {
            lfoGain.connect(oscillator.frequency);
        }

        oscillator.connect(volume);
        volume.connect(master);
        oscillator.start();
    }

    start(velocity, attack) {
        AudioSource.sourceList.push(this);
        this.volume.gain.value = 0;
        this.volume.gain.setTargetAtTime(velocity, this.context.currentTime, attack);
    }

    stop(decay) {
        this.volume.gain.setTargetAtTime(0, this.context.currentTime, decay);
        setTimeout(() => {
            this.oscillator.stop()
            let pos = AudioSource.sourceList.indexOf(this);
            AudioSource.sourceList.splice(pos, 1);
        }, decay + 2);
    }
}

AudioSource.sourceList = [];

export { AudioSource };
