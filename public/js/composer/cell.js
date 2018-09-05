import { ProgramPlayer } from "./program-player.js";


class Cell {
    constructor(owner, top) {
        this.owner = owner;
        this.content = false;
        let div = this.div = document.createElement('div');
        div.classList.add('cell');
        div.addEventListener("click", evt => this.assignNote(evt));
        div.addEventListener("contextmenu", evt => this.empty(evt));
        top.appendChild(div);
    }

    assignNote(evt) {
        this.listening = true;
        this.div.classList.add('assign');
    }

    getStep() {
        let options = {
            note: this.note ? this.note : 'C3',
            duration: 4,
            velocity: this.note ? this.velocity : 0
        };
        return ProgramPlayer.makeStep(options);
    }

    press(note, velocity) {
        if (this.listening) {
            this.setContent(note, velocity);
            this.div.classList.remove('assign');
            this.listening = false;
            this.owner.updateProgram();
        }
    }

    setContent(note, velocity) {
        this.note = note;
        this.velocity = velocity;
        this.setText(`${note}-${velocity}`);
    }

    setText(str) {
        this.div.textContent = str;
    }

    empty(evt) {
        if (evt) { evt.preventDefault(); }
        this.note = false;
        this.setText('');
        this.owner.updateProgram();
    }

    activate(synth) {
        this.div.classList.add('active');
    }

    deactivate(synth) {
        this.div.classList.remove('active');
    }
}

export { Cell };
