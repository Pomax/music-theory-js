import { h, render, Component } from "../preact.js";
import { router } from "../router/router.js";
import { Pattern } from "./pattern.js";
import { TonicStep } from "./tonic-step.js";
import { ProgramPlayer } from "./program-player.js";
import { Drumkit } from "../drumkit/drumkit.js";

class Arranger extends Component {
  constructor(top) {
    super();
    this.player = new ProgramPlayer(this, 135);
  }

  render() {
    return (
      <div>
        <div id="fft"></div>
        <Pattern
          ref={(e) => (this.pattern = e)}
          arranger={this}
          steptype={TonicStep}
        />
        <div className="controls">
          <button onClick={(evt) => this.stop()}>
            <span class="stop"></span>
          </button>
          <button onClick={(evt) => this.play()}>
            <span class="play"></span>
          </button>
          <label className="bpm">
            <input
              type="number"
              min="1"
              max="400"
              value="120"
              onChange={(evt) => this.setBPM(evt.target.value)}
            />
            BPM
          </label>
          <button onClick={(evt) => this.demo()}>demo</button>
        </div>
        <Drumkit ref={(e) => (this.drumkit = e)} />
      </div>
    );
  }

  setBPM(bpm) {
    this.player.setBPM(bpm | 0);
  }

  demo() {
    this.drumkit.demo();
    this.pattern.loadDemo();
  }

  play() {
    let program = this.updateProgram();
    if (program && program.length) {
      this.player.play();
    }
  }

  updateProgram(program) {
    if (!program) {
      program = this.pattern.buildProgram();
    }
    this.player.setProgram(program);
    return program;
  }

  stop() {
    this.pattern.stop();
    this.player.stop();
  }

  /**
   *
   * @param {*} note
   * @param {*} velocity
   * @param {*} delay
   * @return parameter-less function that will stop this note from being played.
   */
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

function setupArranger(container) {
  render(<Arranger />, container);
}

export { setupArranger };
