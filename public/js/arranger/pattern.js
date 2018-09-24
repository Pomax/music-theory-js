var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { h, render, Component } from '../preact.js';
import { Theory } from '../theory.js';

/**
 *
 */
class Pattern extends Component {
    constructor(props) {
        super(props);
        this.arranger = this.props.arranger;
        this.state = { steps: [] };
    }

    render() {
        return h(
            'div',
            { className: 'pattern' },
            h(
                'div',
                { className: 'steps' },
                this.state.steps
            ),
            h(
                'button',
                { className: 'pattern-add', onClick: evt => this.newStep() },
                '+'
            )
        );
    }

    newStep(options) {
        let steps = this.state.steps;
        let step = this.buildStepComponent(options);
        steps.push(step);
        this.setState({ steps });
    }

    buildStepComponent(options) {
        let StepType = this.props.steptype;
        let step = h(StepType, _extends({
            ref: e => step.api = e,
            owner: this,
            onChange: evt => this.handleStepUpdate(),
            onDelete: evt => this.deleteStep(step)
        }, options));
        return step;
    }

    deleteStep(step) {
        let steps = this.state.steps;
        let pos = steps.indexOf(step);
        if (pos > -1) {
            steps.splice(pos, 1);
        }
        this.setState({ steps });
    }

    stop() {
        this.state.steps.forEach(step => step.api.deactivate());
    }

    loadDemo() {
        let _c = o => this.buildStepComponent(o);
        let note = Theory.nameToNumber('C4');
        let steps = [_c({ note, velocity: 50, chord: 'major', tonic: 'I', inversion: -1, octave: 0, duration: '1' }), _c({ note: false, velocity: 0, chord: '', tonic: 'VI', inversion: 0, octave: -1, duration: '1' }), _c({ note: false, velocity: 0, chord: '', tonic: 'i', inversion: -1, octave: 0, duration: '1' }), _c({ note: false, velocity: 0, chord: '', tonic: 'ii', inversion: -1, octave: 0, duration: '2' }), _c({ note: false, velocity: 0, chord: '', tonic: 'II', inversion: 0, octave: 0, duration: '2' })];
        this.setState({ steps });
    }

    handleStepUpdate() {
        let program = this.buildProgram();
        this.arranger.updateProgram(program);
    }

    buildProgram() {
        return this.state.steps.map(step => step.api.getStep());
    }

    markStep(step) {
        let len = this.state.steps.length;
        let pstep = (step + len + -1) % len;
        try {
            this.state.steps[pstep].api.deactivate();
        } catch (e) {
            this.stop();
            this.arranger.stop();
        }
        this.state.steps[step].api.activate();
    }
}

export { Pattern };