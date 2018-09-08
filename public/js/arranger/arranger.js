// And this import... is what this whole repo is for.
import Theory from "../music-theory.js";

import { ProgramPlayer } from "./program-player.js";
import { router } from "../router/router.js";
import { Pattern } from "./pattern.js";

// TODO: silly limitation for now of course: why would
//       an arranger only have one instrument?

class Arranger {
    constructor(top) {
        this.pattern = new Pattern(this, top.querySelector('.cells'));

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
        this.pattern.demo();
        this.play();
    }

    play() {
        this.updateProgram();
        this.player.play();
    }

    updateProgram() {
        this.player.setProgram(this.pattern.buildProgram());
    }

    stop() {
        this.cells.forEach(c => c.deactivate());
        this.player.stop();
    }

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

export { Arranger };
