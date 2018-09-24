import { h, render, Component } from '../preact.js';
import { masterGain } from "../shared/audio-context.js";
import { router } from "../router/router.js";
import { Pattern } from "./pattern.js";
import { TonicStep } from "./tonic-step.js";
import { ProgramPlayer } from "./program-player.js";
import { Drumkit } from "../drumkit/drumkit.js";
import { FFT } from "../shared/fft.svg.js";
import { KeyboardMappings, MapKeys } from "../shared/key-mappings.js";

class FFTPlaceholder extends Component {
    componentDidMount() {
        render(h(FFT, { source: masterGain, refresh: 20 }), document.getElementById('fft'));
    }
    shouldComponentUpdate() {
        // render once, and then keep your hands off.
        return false;
    }
    render() {
        return h("div", { id: "fft" });
    }
}

class Arranger extends Component {
    constructor(top) {
        super();
        this.player = new ProgramPlayer(this, 135);
        this.down = {};
        this.state = {
            virtualKeyboard: false
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", evt => this.handleKeyDown(evt));
        document.addEventListener("keyup", evt => this.handleKeyUp(evt));
    }

    handleKeyDown(evt) {
        if (evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey) return;
        if (this.state.virtualKeyboard) {
            let key = evt.key;
            if (MapKeys.indexOf(key) !== -1 && !this.down[key]) {
                evt.preventDefault();
                let note = KeyboardMappings[key],
                    velocity = key === ' ' ? 0 : 64,
                    tonic = key === ' ' ? '' : 'I';
                this.pattern.newStep({ note, velocity, tonic });
                this.down[key] = this.playNote(note, velocity);
            }
        }
    }

    handleKeyUp(evt) {
        if (evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey) return;
        if (this.state.virtualKeyboard) {
            let key = evt.key;
            let up = this.down[key];
            if (up) up();
            this.down[key] = false;
        }
    }

    render() {
        return h(
            "div",
            null,
            h(FFTPlaceholder, null),
            h(Pattern, { ref: e => this.pattern = e, arranger: this, steptype: TonicStep }),
            h(
                "div",
                { className: "controls" },
                h("span", { className: "keyboard " + (this.state.virtualKeyboard ? 'ON' : 'OFF') }),
                h(
                    "label",
                    { onClick: evt => this.toggleKeyboard(evt) },
                    "Virtual Keyboard"
                ),
                h(
                    "button",
                    { onClick: evt => this.stop() },
                    h("span", { className: "stop" })
                ),
                h(
                    "button",
                    { onClick: evt => this.play() },
                    h("span", { className: "play" })
                ),
                h(
                    "label",
                    { className: "bpm" },
                    h("input", { type: "number", min: "1", max: "400", value: "120", onChange: evt => this.setBPM(evt.target.value) }),
                    "BPM"
                ),
                h(
                    "button",
                    { onClick: evt => this.demo() },
                    "demo"
                )
            ),
            h(Drumkit, { ref: e => this.drumkit = e })
        );
    }

    toggleKeyboard() {
        this.setState({
            virtualKeyboard: !this.state.virtualKeyboard
        });
    }

    setBPM(bpm) {
        this.player.setBPM(bpm | 0);
    }

    demo() {
        this.drumkit.demo();
        this.pattern.loadDemo();
    }

    play() {
        let program = this.updateProgram();
        if (program && program.length) {
            this.player.play();
        }
    }

    updateProgram(program) {
        if (!program) {
            program = this.pattern.buildProgram();
        }
        this.player.setProgram(program);
        return program;
    }

    stop() {
        this.pattern.stop();
        this.player.stop();
    }

    /**
     *
     * @param {*} note
     * @param {*} velocity
     * @param {*} delay
     * @return parameter-less function that will stop this note from being played.
     */
    playNote(note, velocity, delay) {
        let fn = () => router.signalnoteon(0, note, velocity);

        if (!delay) {
            fn();
        } else {
            setTimeout(fn, delay);
        }

        return () => router.signalnoteoff(0, note, 0);
    }

    markStep(step) {
        this.pattern.markStep(step);
    }
}

function setupArranger(top) {
    render(h(Arranger, null), top);
}

export { setupArranger };