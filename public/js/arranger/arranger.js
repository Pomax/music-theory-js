// And this import... is what this whole repo is for.
import Theory from "../music-theory.js";

import { Cell } from "./cell.js";
import { ProgramPlayer } from "./program-player.js";

// TODO: silly limitation for now of course: why would
//       an arranger only have one instrument?

class Arranger {
    constructor(instrument, top) {
        this.instrument = instrument;

        this.cellCount = 32;
        let cellContainer = top.querySelector('.cells');
        this.cells = [...(new Array(this.cellCount))].map(_ => new Cell(this, cellContainer));
        this.currentCell = -1;

        let controls = document.createElement("div");
        controls.classList.add('controls');
        top.appendChild(controls);

        let button = this.stopButton = document.createElement("button");
        button.textContent = "◼";
        button.addEventListener("click", evt => this.stop());
        controls.appendChild(button);

        button = this.playButton = document.createElement("button");
        button.textContent = "▶";
        button.addEventListener("click", evt => this.play());
        controls.appendChild(button);

        let bpmLabel = document.createElement("label");
        bpmLabel.classList.add('bpm');
        bpmLabel.textContent = " BPM";
        controls.appendChild(bpmLabel);

        let bpm = this.bpm = document.createElement("input");
        bpm.type = "number";
        bpm.setAttribute("min", 1);
        bpm.setAttribute("max", 400);
        bpm.setAttribute("value", 120);
        bpm.addEventListener("change", evt => this.setBPM(evt.target.value));
        bpmLabel.appendChild(bpm);
        bpmLabel.appendChild(bpmLabel.childNodes[0]);
        this.player = new ProgramPlayer(this, bpm.value);

        button = this.demoButton = document.createElement("button");
        button.textContent = "demo";
        button.addEventListener("click", evt => this.demo());
        controls.appendChild(button);
    }

    setBPM(bpm) {
        this.player.setBPM(bpm|0);
    }

    demo() {
        this.cells[0].setContent(Theory.nameToNumber('C3'), 64);
        this.cells[4].setContent(Theory.nameToNumber('C3'), 64);
        this.cells[8].setContent(Theory.nameToNumber('C3'), 64);
        this.cells[12].setContent(Theory.nameToNumber('C3'), 64);

        this.cells[14].setContent(Theory.nameToNumber('F3'), 64);
        this.cells[15].setContent(Theory.nameToNumber('G3'), 64);

        this.cells[16].setContent(Theory.nameToNumber('C3'), 64);
        this.cells[20].setContent(Theory.nameToNumber('C3'), 64);
        this.cells[24].setContent(Theory.nameToNumber('C3'), 64);
        this.cells[28].setContent(Theory.nameToNumber('C3'), 64);

        this.cells[30].setContent(Theory.nameToNumber('C4'), 64);
        this.cells[31].setContent(Theory.nameToNumber('G4'), 64);
        this.play();
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
        return this.instrument.playNote(note, velocity, delay);
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

export { Arranger };
