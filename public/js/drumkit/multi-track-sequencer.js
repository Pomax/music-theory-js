import { INTERVALS } from "../intervals.js";
import { Ticker } from "../arranger/ticker.js";
import { Track } from "./track.js";

class MultiTrackSequencer {
    constructor(kit, stepCount=32, ticksPerStep=INTERVALS['8']) {
        this.ticker = Ticker.getMaster();

        this.tracks = [];
        this.namedTracks = {};

        Object.keys(kit).map(name => {
            let track = new Track(name, kit[name], stepCount, ticksPerStep, this.ticker);
            this.tracks.push(track);
            this.namedTracks[name] = track;
        });
    }

    getTrackNames() {
        return Object.keys(this.namedTracks);
    }

    play() {
        this.ticker.play();
    }

    stop() {
        this.ticker.stop();
    }

    trigger(step, trackName, volume, interrupt) {
        this.namedTracks[trackName].trigger(step, volume, interrupt);
    }

    interrupt(step, trackName) {
        this.namedTracks[trackName].interrupt(step);
    }

    clear(step, trackName) {
        if (trackName) {
           return this.namedTracks[trackName].off(step);
        }
        this.tracks.forEach(t => t.off(step));
    }
}

export { MultiTrackSequencer };
