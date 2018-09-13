import { h, render, Component } from '../preact.js';

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
        return (
            <div className="cells">
                { this.state.cells }
                <button onClick={evt => this.newCell()}>+</button>
            </div>
        );
    }

    newCell() {
        let CellType = this.props.celltype;
        let cells = this.state.cells;
        let cell = <CellType ref={e => (cell.api = e)} owner={this} onChange={evt => this.handleCellUpdate()} onDelete={evt => this.deleteCell(cell)}/>;
        cells.push(cell);
        this.setState({ cells });
    }

    deleteCell(cell) {
        let cells = this.state.cells;
        let pos = cells.indexOf(cell);
        if (pos > -1) {
            cells.splice(pos,1);
        }
        this.setState({ cells });
    }

    stop() {
        this.state.cells.forEach(cell => cell.api.deactivate());
    }

    demo() {
        // ...
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

