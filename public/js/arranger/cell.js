import { ProgramPlayer } from "./program-player.js";


class Cell {
    constructor(owner, top) {
        this.owner = owner;
        this.content = false;

        let div = this.div = document.createElement('div');
        div.classList.add('cell');
        div.addEventListener("click", evt => this.assignNote(evt));

        let clear = this.clear = document.createElement("button");
        clear.classList.add('cell-clear');
        clear.addEventListener("click", evt => this.empty(evt));
        clear.textContent = 'X';

        div.appendChild(clear);
        top.appendChild(div);
    }

    assignNote(evt) {
        if (evt.target !== this.div) return;
        this.listening = true;
        this.div.classList.add('assign');
    }

    getStep() {
        let options = {
            note: this.note ? this.note : 'C3',
            duration: 16,
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
        this.div.appendChild(this.clear);
        this.clear.disabled = false;
    }

    empty(evt) {
        if (evt) { evt.preventDefault(); }
        this.note = false;
        this.setText('');
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
