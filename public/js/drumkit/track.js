// single 32 step sequencer
class Track {
    constructor(name, instrument, stepCount=32, ticksPerStep, ticker) {
        ticker.addReceiver(this);
        this.name = name;
        this.instrument = instrument;
        this.stepCount = stepCount;
        this.steps = [...new Array(stepCount)];
        this.ticksPerStep = ticksPerStep;
        this.reset();
    }

    reset() {
        this.step = -1;
    }

    tickStarted() {
        // do nothing
    }

    tickStopped() {
        this.reset();
    }

    tick(tickCount) {
        let step = ((tickCount / this.ticksPerStep)|0) % this.stepCount;
        if (step !== this.step) {
            this.step = step;
            this.playStep(this.step);
        }
    }

    playStep(step) {
        let instruction = this.steps[step];

        if (instruction) {
            if (instruction.interrupt) {
                this.instrument.interrupt();
            }
            this.instrument.play(instruction.volume);
        }
    }

    trigger(step, volume=1.0, interrupt=false) {
        this.steps[step] = { volume, interrupt };
    }

    interrupt(step) {
        // treat this step purely as a cutoff for the previous
        // step, without playing the associated instrument.
        this.trigger(step, 0.0, true);
    }

    off(step) {
        if (step !== undefined) {
            return (this.steps[step] = EMPTY);
        }
        // if this was called as off(), clear ALL instruction.
        this.steps = [...new Array(stepCount)];
    }
}

export { Track };
