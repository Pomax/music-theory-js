import { h, render, Component } from "../preact.js";
import { INTERVALS } from "../shared/intervals.js";
import { Ticker } from "../shared/ticker.js";
import { Track } from "./track.js";

class MultiTrackSequencer extends Component {
    constructor(props) {
        super(props);
        let instruments = this.props.instruments;
        let stepCount = this.props.stepCount || 32;
        let ticksPerStep = this.props.ticksPerStep || INTERVALS['8'];

        this.ticker = Ticker.getMaster();
        let tracks = this.tracks = [];
        this.namedTracks = {};

        Object.keys(instruments).map(name => {
            let track = h(Track, { ref: e => track.api = e, name: name, instrument: instruments[name], stepCount: stepCount, ticksPerStep: ticksPerStep });
            this.tracks.push(track);
            this.namedTracks[name] = track;
        });

        this.state = {
            tracks,
            collapsed: true
        };
    }

    render() {
        return h(
            "div",
            null,
            h(
                "div",
                { className: "multi-track-sequencer" + (this.state.collapsed ? " collapsed" : "") },
                this.state.tracks
            ),
            h(
                "div",
                { className: "multi-track-sequencer-ui-toggle", onClick: evt => this.toggleUI() },
                this.state.collapsed ? '▷' : '◁'
            )
        );
    }

    toggleUI() {
        this.setState({
            collapsed: !this.state.collapsed
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