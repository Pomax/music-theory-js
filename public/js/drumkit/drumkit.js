import { h, render, Component } from "../preact.js";
import { ifdebug } from "../if-debug.js";
import { samples } from "../shared/samples.js";
import { MultiTrackSequencer } from "./multi-track-sequencer.js";
import { context, masterGain } from "../shared/audio-context.js";

function load(url) {
    let sample = {
        url: url,
        loaded: false,
        play: (volume) => {
            let source = sample.source = context.createBufferSource();
            source.buffer = sample.buffer;
            let gain = sample.gain = context.createGain();
            gain.gain.value = volume;
            source.connect(gain);
            gain.connect(masterGain);
            source.start() ;
            source.onended = (evt) => {
                source.disconnect();
                try { gain.disconnect(masterGain) }
                catch(e) { console.warn(e); }
            }
        },
        interrupt: () => {
            if (sample.source) {
                try { sample.source.disconnect(sample.gain); } catch(e) { console.warn(e); }
                try { sample.gain.disconnect(masterGain); } catch(e) { console.warn(e); }
            }
        }
    };

    window
    .fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        sample.buffer = audioBuffer;
        if (sample.onload) sample.onload();
        sample.loaded = true;
    })
    .catch(error => {
        console.error(error);
        if (sample.onerror) sample.onerror(e);
    });

    return sample;
}

const drumkit = {
    kick1: load(samples.kicks[2]),
    kick2: load(samples.kicks[3]),
    kick3: load(samples.kicks[8]),
    kick4: load(samples.kicks[11]),
    snare1: load(samples.snares[2]),
    snare2: load(samples.snares[3]),
    stick1: load(samples.sticks[1]),
    stick2: load(samples.sticks[2]),
    hihat1: load(samples.hihat.closed[3]),
    hihat2: load(samples.hihat.closed[4]),
    hihat3: load(samples.hihat.open[1]),
    ride1: load(samples.ride[2]),
    ride2: load(samples.ride[4]),
    crash1: load(samples.crash[3]),
    crash2: load(samples.crash[2]),
}

const sequencer = h(MultiTrackSequencer, {
    ref: e => (sequencer.api = e),
    instruments: drumkit
});

// A simple demo program.
sequencer.demo = () => {
    let s = sequencer.api;
    for(let i=0; i<32; i++) {
        if([0,3,8,9,11,  16,19,24,25,27].indexOf(i)>-1) {
            s.trigger(i, 'kick1');
        }
        if((i+4)%8 === 0) {
            s.trigger(i, 'stick2');
            s.trigger(i+1, 'stick2', 0.2);
        }
        if((i+4)%4 === 2) {
            s.trigger(i, 'ride2', 0.5);
        }
        if(i !== 7 && i !== 23) {
            s.trigger(i, 'hihat2', 1 - (i%4)*0.2);
        } else {
            s.trigger(i, 'hihat3');
            s.interrupt(i+1, 'hihat3');
        }
    }
}

function setupSequencer(top) {
    render(sequencer, top);
}


ifdebug( () => {
  window.drumkit = drumkit;
  window.sequencer = sequencer;
});

export { drumkit, sequencer, setupSequencer };
