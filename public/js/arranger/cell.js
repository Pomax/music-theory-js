import { ProgramPlayer } from "./program-player.js";
import { INTERVALS } from "./intervals.js";
import Theory from "../music-theory.js";
import { router } from "../router/router.js";

/**
 *
 */
class Cell {
    constructor(owner, top) {
        this.owner = owner;
        this.content = false;

        let div = this.div = document.createElement('div');
        div.classList.add('cell');

        let noteinfo = this.noteinfo = document.createElement('span');
        noteinfo.classList.add('note-info');
        noteinfo.addEventListener("click", evt => this.assignNote(evt));
        div.appendChild(noteinfo);

        let duration = this.durationSelector = document.createElement('select');
        let option = document.createElement('option');
        option.textContent = '';
        option.value = ''
        option.selected = true;
        duration.appendChild(option);
        Object.keys(INTERVALS).forEach(t => {
            let option = document.createElement('option');
            option.textContent = t;
            option.value = t;
            duration.appendChild(option);
        });
        duration.addEventListener("change", evt => {
            this.duration = evt.target.value;
            this.owner.updateProgram();
        });
        div.appendChild(duration);

        let chords = this.chordSelector = document.createElement('select');
        option = document.createElement('option');
        option.textContent = '';
        option.value = ''
        chords.appendChild(option);
        Object.keys(Theory.chords).forEach(t => {
            let option = document.createElement('option');
            option.textContent = t;
            option.value = t;
            chords.appendChild(option);
        });
        chords.addEventListener("change", evt => {
            this.chord = evt.target.value;
            this.owner.updateProgram();
        });
        div.appendChild(chords);

        let clear = this.clear = document.createElement("button");
        clear.classList.add('cell-clear');
        clear.addEventListener("click", evt => this.empty(evt));
        clear.textContent = 'X';

        div.appendChild(clear);
        top.appendChild(div);
    }

    assignNote(evt) {
        if (evt.target !== this.noteinfo) return;
        this.noteinfo.classList.add('assign');
        router.addListener(this, "noteon");
    }

    getStep() {
        let options = {
            note: this.note ? this.note : 'C3',
            chord: this.chord,
            duration: this.duration || 0,
            velocity: this.note ? this.velocity : 0
        };
        return ProgramPlayer.makeStep(options);
    }

    onNoteOn(note, velocity) {
        router.removeListener(this, "noteon");
        this.setContent(note, velocity);
        this.noteinfo.classList.remove('assign');
        this.owner.updateProgram();
    }

    setContent(note, velocity, duration, chord) {
        this.note = note;
        this.velocity = velocity;
        this.setText(`${note}-${velocity}`);
        if (!this.duration || duration) {
            this.setDuration(duration || 4);
        }
        if (chord) {
            this.setChord(chord);
        }
    }

    setDuration(d) {
        this.durationSelector.value = d;
        this.duration = d;
    }

    setChord(c) {
        this.chordSelector.value = c;
        this.chord = c;
    }

    setText(str) {
        this.noteinfo.textContent = str;
        this.clear.disabled = false;
    }

    empty(evt) {
        if (evt) { evt.preventDefault(); }
        this.note = false;
        this.setText('');
        this.setDuration('');
        this.setChord('');
        this.owner.updateProgram();
        this.clear.disabled = true;
    }

    activate(synth) {
        this.div.classList.add('active');
    }

    deactivate(synth) {
        this.div.classList.remove('active');
    }
}

export { Cell };
