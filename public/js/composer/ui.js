// And this import... is what this whole repo is for.
import Theory from "../music-theory.js";

import { Cell } from "./cell.js";
import { ProgramPlayer } from "./program-player.js";

class ComposerUI {
    constructor(synth, top) {
        this.synth = synth;
        this.cells = [...(new Array(16))].map(_ => new Cell(this, top));
        this.currentCell = -1;
        this.player = new ProgramPlayer(this, 120);

        let controls = document.createElement("div");
        controls.classList.add('controls');

        let button = this.stopButton = document.createElement("button");
        button.textContent = "◼";
        button.addEventListener("click", evt => this.stop());
        controls.appendChild(button);

        button = this.playButton = document.createElement("button");
        button.textContent = "▶";
        button.addEventListener("click", evt => this.play());
        controls.appendChild(button);

        top.appendChild(controls);
    }

    play() {
        this.updateProgram();
        this.player.play();
    }

    updateProgram() {
        this.player.setProgram(this.buildProgram());
    }

    stop() {
        this.cells.forEach(c => c.deactivate());
        this.player.stop();
    }

    playNote(note, velocity, delay) {
        return this.synth.playNote(note, velocity, delay);
    }

    buildProgram() {
        return this.cells.map(cell => cell.getStep());
    }

    press(note, velocity) {
        this.cells.forEach(c => c.press(note, velocity));
    }

    markStep(step) {
        let len = this.cells.length;
        let pstep = (step + len - 1) % len;
        this.cells[pstep].deactivate();
        this.cells[step].activate();
    }
}

export { ComposerUI };
