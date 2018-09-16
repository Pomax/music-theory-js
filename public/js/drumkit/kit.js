import { context, masterGain } from "../shared/audio-context.js";
import { samples } from "../shared/samples.js";

class Sample {
    constructor() {
        this.loaded = false;

        const load = url => {
            window
            .fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.buffer = audioBuffer;
                if (this.onload) this.onload();
                this.loaded = true;
            })
            .catch(error => {
                console.error(error);
                if (this.onerror) this.onerror(e);
            });
        }

        Object.defineProperty(this, 'url', {
            get: () => this._url,
            set: url => load(url)
        });
    }
    play (volume, trackGain) {
        let source = this.source = context.createBufferSource();
        source.buffer = this.buffer;
        let gain = this.gain = context.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        if (trackGain) {
            gain.connect(trackGain);
            trackGain.connect(masterGain);
        } else {
            gain.connect(masterGain);
        }
        source.start();
        source.onended = (evt) => {
            source.disconnect();
            gain.disconnect();
        }
    }
    interrupt() {
        if (this.source) {
            this.source.disconnect();
            this.gain.disconnect();
        }
    }
}

function loadSample(url) {
    let sample = new Sample();
    sample.url = url;
    return sample;
}

const drumkit = {
    kick1: loadSample(samples.kicks[2]),
    kick2: loadSample(samples.kicks[3]),
    kick3: loadSample(samples.kicks[8]),
    kick4: loadSample(samples.kicks[11]),
    snare1: loadSample(samples.snares[2]),
    snare2: loadSample(samples.snares[3]),
    stick1: loadSample(samples.sticks[1]),
    stick2: loadSample(samples.sticks[2]),
    hihat1: loadSample(samples.hihat.closed[3]),
    hihat2: loadSample(samples.hihat.closed[4]),
    hihat3: loadSample(samples.hihat.open[1]),
    ride1: loadSample(samples.ride[2]),
    ride2: loadSample(samples.ride[4]),
    crash1: loadSample(samples.crash[3]),
    crash2: loadSample(samples.crash[2]),
}

export { drumkit as instruments };
