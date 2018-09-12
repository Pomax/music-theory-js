import { h, render, Component } from '../preact.js';

import { CustomSelector } from "./custom-selector.js";
import { ProgramPlayer } from "./program-player.js";
import { INTERVALS } from "./intervals.js";
import { Theory } from "../theory.js";
import { router } from "../router/router.js";

/**
 * ...
 */
class Cell extends Component {
    constructor(owner, top) {
        super();
        this.owner = owner;
        this.content = false;
        this.state = {
            note: false,
            velocity: 0,
            tonic: 'I',
            duration: '4',
            inversion: 0,
            octave: 0,
        }
    }

    render() {
        let topClasses = ["cell", this.state.active? 'active' : ''].join(' ');
        let noteClasses = ["note-info", this.state.listening ? 'assign' : ''].join(' ');

        return (
            <div className={topClasses}>
                <div className={noteClasses} onClick={ evt => this.assignNote(evt)}>{this.state.note}-{this.state.velocity}</div>
                <CustomSelector owner={this} label="duration"  options={ INTERVALS } />
                <CustomSelector owner={this} label="tonic"     options={ ['I','i','II','ii','III','iii','IV','iv','V','v','VI','vi','VII','vii'] } />
                <CustomSelector owner={this} label="chord"     options={ Theory.chords } />
                <CustomSelector owner={this} label="inversion" options={ [-5,-4,-3,-2,-1,0,1,2,3,4,5] } />
                <CustomSelector owner={this} label="octave"    options={ [-5,-4,-3,-2,-1,0,1,2,3,4,5] } />
                <button className="cell-clear" onClick={evt => this.delete()}>X</button>
            </div>
        );
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

    setContent(note, velocity, duration, chord) {
        this.setState({ note, velocity, duration, chord}, () => {
            this.contentUpdated();
        })
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

export { Cell };
