import { h, render, Component } from '../preact.js';

import { CustomSelector } from "./custom-selector.js";
import { ProgramPlayer } from "./program-player.js";
import { INTERVALS } from "../shared/intervals.js";
import { Theory } from "../theory.js";
import { router } from "../router/router.js";

/**
 * ...
 */
class Step extends Component {
    constructor(props) {
        super(props);

        this.owner = this.props.owner;
        this.content = false;

        this.selectors = {
            duration: INTERVALS,
            chord: Theory.chords,
            inversion: [-5,-4,-3,-2,-1,0,1,2,3,4,5],
            octave: [-5,-4,-3,-2,-1,0,1,2,3,4,5]
        };

        this.state = {
            note: this.props.note || false,
            velocity: this.props.velocity || 0,
            duration: this.props.duration || '4',
            chord: this.props.chord || '',
            inversion: this.props.inversion || 0,
            octave: this.props.octave || 0,
        }
    }

    render() {
        let topClasses = ["cell", this.state.active? 'active' : ''].join(' ');
        let noteClasses = ["note-info", this.state.listening ? 'assign' : ''].join(' ');
        let label = this.state.note ? `${this.state.note}-${this.state.velocity}` : '-';

        return (
            <div className={topClasses}>
                <div className={noteClasses} onClick={ evt => this.assignNote(evt)}>{ label }</div>
                { this.renderSelectors() }
                <button className="cell-clear" onClick={evt => this.delete()}>X</button>
            </div>
        );
    }

    renderSelectors() {
        let s = this.selectors;
        let labels = Object.keys(s);
        return labels.map(label => <CustomSelector owner={this} label={label} key={label} options={s[label]} />);
    }

    assignNote(evt) {
        this.setState({ listening: true });
        this.activateAssignmentListeners();
    }

    activateAssignmentListeners() {
        router.addListener(this, "noteon");
        let escListener = evt => {
            if (evt.keyCode === 27) {
                router.removeListener(this, "noteon");
                this.setState({ listening: false });
            }
            document.removeEventListener("keydown", escListener);
        }
        document.addEventListener("keydown", escListener);
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
