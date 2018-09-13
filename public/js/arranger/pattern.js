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
        this.state = { cells: [] };
    }

    render() {
        return h(
            'div',
            { className: 'cells' },
            this.state.cells,
            h(
                'button',
                { onClick: evt => this.newCell() },
                '+'
            )
        );
    }

    newCell(options) {
        let cells = this.state.cells;
        let cell = this.buildCellComponent(options);
        cells.push(cell);
        this.setState({ cells });
    }

    buildCellComponent(options) {
        let StepType = this.props.steptype;
        let cell = h(StepType, _extends({
            ref: e => cell.api = e,
            owner: this,
            onChange: evt => this.handleCellUpdate(),
            onDelete: evt => this.deleteCell(cell)
        }, options));
        return cell;
    }

    deleteCell(cell) {
        let cells = this.state.cells;
        let pos = cells.indexOf(cell);
        if (pos > -1) {
            cells.splice(pos, 1);
        }
        this.setState({ cells });
    }

    stop() {
        this.state.cells.forEach(cell => cell.api.deactivate());
    }

    loadDemo() {
        let _c = o => this.buildCellComponent(o);
        let note = Theory.nameToNumber('C4');
        let cells = [_c({ note, velocity: 50, chord: 'major', tonic: 'I', inversion: -1, octave: 0, duration: '1' }), _c({ note: false, velocity: 0, chord: '', tonic: 'VI', inversion: 0, octave: -1, duration: '1' }), _c({ note: false, velocity: 0, chord: '', tonic: 'i', inversion: -1, octave: 0, duration: '1' }), _c({ note: false, velocity: 0, chord: '', tonic: 'ii', inversion: -1, octave: 0, duration: '2' }), _c({ note: false, velocity: 0, chord: '', tonic: 'II', inversion: 0, octave: 0, duration: '2' })];
        this.setState({ cells });
    }

    handleCellUpdate(cell, step) {
        let program = this.buildProgram();
        this.arranger.updateProgram(program);
    }

    buildProgram() {
        return this.state.cells.map(cell => cell.api.getStep());
    }

    markStep(step) {
        let len = this.state.cells.length;
        let pstep = (step + len - 1) % len;
        this.state.cells[pstep].api.deactivate();
        this.state.cells[step].api.activate();
    }
}

export { Pattern };