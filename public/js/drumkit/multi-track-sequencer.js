import { h, render, Component } from "../preact.js";
import { INTERVALS } from "../shared/intervals.js";
import { Ticker } from "../shared/ticker.js";
import { Track } from "./track.js";
import { Slider } from "../shared/slider.js";
import { context } from "../shared/audio-context.js";

class MultiTrackSequencer extends Component {
    constructor(props) {
        super(props);

        let instruments = this.props.instruments;
        let stepCount = this.props.stepCount || 32;
        let ticksPerStep = this.props.ticksPerStep || INTERVALS['8'];

        this.ticker = Ticker.getMaster();
        let tracks = this.tracks = [];
        this.namedTracks = {};

        // master volume for all tracks
        this.gainNode = context.createGain();
        this.volume = h(Slider, { label: "volume", value: 1.0, onInput: v => this.gainNode.gain.value = v });

        Object.keys(instruments).map(name => {
            let track = h(Track, { ref: e => track.api = e, name: name, instrument: instruments[name], stepCount: stepCount, ticksPerStep: ticksPerStep, volume: this.gainNode });
            this.tracks.push(track);
            this.namedTracks[name] = track;
        });

        this.state = { tracks };
    }

    render() {
        return h(
            "div",
            { className: "multi-track-sequencer" + (this.props.collapsed ? " collapsed" : "") },
            this.volume,
            this.state.tracks
        );
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
        this.namedTracks[trackName].api.trigger(step, volume, interrupt);
    }

    interrupt(step, trackName) {
        this.namedTracks[trackName].api.interrupt(step);
    }

    clear(step, trackName) {
        if (trackName) {
            return this.namedTracks[trackName].api.off(step);
        }
        this.tracks.forEach(t => t.api.off(step));
    }
}

export { MultiTrackSequencer };