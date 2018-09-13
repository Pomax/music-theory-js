import { h, render, Component } from '../preact.js';

import { CustomSelector } from "./custom-selector.js";
import { ProgramPlayer } from "./program-player.js";
import { INTERVALS } from "../intervals.js";
import { Theory } from "../theory.js";
import { router } from "../router/router.js";

/**
 * ...
 */
class Step extends Component {
    constructor(owner, top) {
        super();
        this.owner = owner;
        this.content = false;
        this.selectors = {
            duration: INTERVALS,
            chord: Theory.chords,
            inversion: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
            octave: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
        };
        this.state = {
            note: false,
            velocity: 0,
            duration: '4',
            inversion: 0,
            octave: 0
        };
    }

    render() {
        let topClasses = ["cell", this.state.active ? 'active' : ''].join(' ');
        let noteClasses = ["note-info", this.state.listening ? 'assign' : ''].join(' ');

        return h(
            "div",
            { className: topClasses },
            h(
                "div",
                { className: noteClasses, onClick: evt => this.assignNote(evt) },
                this.state.note,
                "-",
                this.state.velocity
            ),
            this.renderSelectors(),
            h(
                "button",
                { className: "cell-clear", onClick: evt => this.delete() },
                "X"
            )
        );
    }

    renderSelectors() {
        let s = this.selectors;
        let labels = Object.keys(s);
        return labels.map(label => h(CustomSelector, { owner: this, label: label, key: label, options: s[label] }));
    }

    assignNote(evt) {
        this.setState({ listening: true });
        router.addListener(this, "noteon");
    }

    getStep() {
        let options = JSON.parse(JSON.stringify(this.state));
        return ProgramPlayer.makeStep(options);
    }

    contentUpdated() {
        this.props.onChange(this, this.getStep());
    }

    onNoteOn(note, velocity) {
        router.removeListener(this, "noteon");
        this.setState({ note, velocity, listening: false }, () => {
            this.contentUpdated();
        });
    }

    delete(evt) {
        this.props.onDelete(this);
    }

    activate(synth) {
        this.setState({ active: true });
    }

    deactivate(synth) {
        this.setState({ active: false });
    }
}

export { Step };