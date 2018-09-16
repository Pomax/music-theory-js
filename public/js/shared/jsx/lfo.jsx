import { h, render, Component } from "../preact.js";
import { context } from "../shared/audio-context.js";
import { Slider } from "./slider.js";

const DEFAULT_FREQUENCY = 3.0;
const DEFAULT_STRENGTH = 1.5;

class LFO extends Component {
    constructor(props) {
        super(props);

        let lfo = context.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = DEFAULT_FREQUENCY;
        lfo.start();

        let gain = context.createGain();
        gain.gain.value = DEFAULT_STRENGTH;

        lfo.connect(gain);

        this.state = {
            bypass: false,
            frequency: DEFAULT_FREQUENCY,
            strength: DEFAULT_STRENGTH,
            lfo,
            gain
        };
    }

    render() {
        let bypass = (this.state.bypass ? ' bypass': '');
        return (
            <div class={'LFO' + bypass}>
                <div className={'toggle'} onClick={e => this.toggleBypass()}></div>
                <Slider disabled={bypass} cc={0} max={10} value={3.0} label="lfo freq" onInput={v => this.setFrequency(v)}/>
                <Slider disabled={bypass} cc={0} max={10} value={3.0} label="lfo mix" onInput={v => this.setStrength(v)}/>
            </div>
        );
    }

    toggleBypass() {
        let bypass = !this.state.bypass;
        this.setState({ bypass });
        if (bypass) {
            this._gain_value = this.state.gain.gain.value;
            this.state.gain.gain.value = 0;
        } else {
            this.state.gain.gain.value = this._gain_value;
        }
    }

    setFrequency(v) {
        this.state.lfo.frequency.value = v;
        this.setState({ frequency: v });
    }

    setStrength(v) {
        this.state.gain.gain.value = v;
        this.setState({ strength: v });
    }

    getOutput() {
        return this.state.gain;
    }
}

export { LFO };

