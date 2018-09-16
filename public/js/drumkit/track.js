import { h, render, Component } from "../preact.js";
import { Ticker } from "../shared/ticker.js";
import { levels } from "./kit.js";

// step sequencer, 32 step by default
class Track extends Component {
    constructor(props) {
        super(props);

        let ticker = Ticker.getMaster();
        ticker.addReceiver(this);
        this.stepCount = this.props.stepCount;
        let steps = this.steps = [...new Array(this.props.stepCount)];
        this.state = { steps };
        this.ticksPerStep = this.props.ticksPerStep;
        this.reset();
    }

    render() {
        return h(
            "div",
            { className: "track" },
            h(
                "div",
                { className: "label", onClick: evt => this.preview() },
                this.props.name,
                h(
                    "span",
                    { className: "volume", onClick: evt => this.toggleVolume() },
                    this.state.showVolume ? '⪡' : '♬'
                )
            ),
            this.renderSteps()
        );
    }

    renderSteps() {
        return this.state.steps.map((step, i) => {
            let stepClass = ['step', this.state.playing === i ? ' active' : '', this.getPlayStateClass(step), this.state.showVolume ? 'volume' : ''].filter(v => v).join(' ');

            const clickHandler = this.state.showVolume ? e => this.cycleVolume(i) : e => this.cycle(i);

            let label = '';
            if (step && this.state.showVolume) {
                if (step.volume === levels[0]) label = '5';
                if (step.volume === levels[1]) label = '4';
                if (step.volume === levels[2]) label = '3';
                if (step.volume === levels[3]) label = '2';
                if (step.volume === levels[4]) label = '1';
            }
            return h(
                "div",
                { className: stepClass, onClick: clickHandler },
                label
            );
        });
    }

    toggleVolume() {
        this.setState({
            showVolume: !this.state.showVolume
        });
    }

    getPlayStateClass(step) {
        if (!step) return '';
        if (step.volume && !step.interrupt) return 'play';
        if (step.volume && step.interrupt) return 'cut-and-play';
        if (!step.volume && step.interrupt) return 'cut';
        console.log(step);
        return ''; // we should never be able to get here
    }

    reset() {
        this.setState({ playing: false });
        this.step = -1;
    }

    tickStarted() {
        // do nothing
    }

    tickStopped() {
        this.reset();
    }

    tick(tickCount) {
        let step = (tickCount / this.ticksPerStep | 0) % this.stepCount;
        if (step !== this.step) {
            this.step = step;
            this.playStep(this.step);
        }
    }

    preview() {
        this.props.instrument.play(1.0, this.props.volume);
    }

    playInstrument(instruction) {
        let instrument = this.props.instrument;
        if (instruction.interrupt) {
            instrument.interrupt();
        }
        instrument.play(instruction.volume, this.props.volume);
    }

    playStep(step) {
        this.setState({ playing: step });
        let instruction = this.steps[step];

        if (instruction) {
            this.playInstrument(instruction);
        }
    }

    cycle(step) {
        let e = this.steps[step];
        if (!e) {
            // do nothing => play this instrument
            this.trigger(step);
            this.playInstrument(this.steps[step]);
            return;
        }
        if (!e.interrupt) {
            // play => play and interrupt previous
            e.interrupt = true;
        } else if (e.volume) {
            // play and interrupt previous => interrupt only
            e.volume = 0;
        } else {
            // interrupt only => do nothing
            this.steps[step] = false;
        }
        this.updateSteps();
    }

    cycleVolume(step) {
        let e = this.steps[step];
        // there has to be a step before we can cycle volume
        if (!e) {
            return;
        }
        if (e.volume === levels[4]) e.volume = levels[0];else if (e.volume === levels[3]) e.volume = levels[4];else if (e.volume === levels[2]) e.volume = levels[3];else if (e.volume === levels[1]) e.volume = levels[2];else if (e.volume === levels[0]) e.volume = levels[1];
        this.updateSteps();
    }

    trigger(step, volume = 1.0, interrupt = false) {
        this.steps[step] = { volume, interrupt };
        this.updateSteps();
    }

    interrupt(step) {
        // treat this step purely as a cutoff for the previous
        // step, without playing the associated instrument.
        this.trigger(step, 0.0, true);
    }

    off(step) {
        if (step !== undefined) {
            return this.steps[step] = EMPTY;
        }
        // if this was called as off(), clear ALL instruction.
        this.steps = [...new Array(this.stepCount)];
        this.updateSteps();
    }

    updateSteps() {
        this.setState({ steps: this.steps });
    }
}

export { Track };