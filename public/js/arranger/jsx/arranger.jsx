import { h, render, Component } from '../preact.js';
import { router } from "../router/router.js";
import { Pattern } from "./pattern.js";
import { ProgramPlayer } from "./program-player.js";

class Arranger extends Component {
    constructor(top) {
        super();
        this.player = new ProgramPlayer(this, 120);
    }

    render() {
        return (
            <div className="controls">
                <Pattern ref={ e => (this.pattern = e) } arranger={this} />
                <button onClick={evt => this.stop()}>◼</button>
                <button onClick={evt => this.play()}>▶</button>
                <label className="bpm">
                  <input type="number" min="1" max="400" value="120" onChange={evt => this.setBPM(evt.target.value)}/>
                  BPM
                </label>
                <button onClick={evt => this.demo()}>demo</button>
            </div>
        );
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

    updateProgram(program) {
        if (!program) {
            program = this.pattern.buildProgram();
        }
        console.log('setting program');
        this.player.setProgram(program);
    }

    stop() {
        this.pattern.stop();
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

function setupArranger(top) {
    render(<Arranger/>, top);
}

export { setupArranger };
