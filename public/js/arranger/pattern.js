import { Cell } from "./cell.js";

/**
 *
 */
class Pattern {
    constructor(arranger, cellContainer) {
        this.arranger = arranger;
        this.cellCount = 32;
        this.cells = [...(new Array(this.cellCount))].map(_ => new Cell(this, cellContainer));
        this.currentCell = -1;
    }

    demo() {
        let id = 0;
        this.cells[id++].setContent(48, 64, 4, 'major');
        this.cells[id++].setContent(55, 64, 4);
        this.cells[id++].setContent(60, 64, 4);
        this.cells[id++].setContent(67, 64, 4);
        this.cells[id++].setContent(63, 64, 8, '6/9');
        this.cells[id++].setContent(60, 64, 8);
        this.cells[id++].setContent(58, 64, 8);
        this.cells[id++].setContent(55, 64, 8);
        this.cells[id++].setContent(53, 64, 8, 'minor');
        this.cells[id++].setContent(51, 64, 8);
        this.cells[id++].setContent(48, 64, 8);
        this.cells[id++].setContent(46, 64, 8);
    }

    buildProgram() {
        return this.cells.map(cell => cell.getStep());
    }

    updateProgram() {
        this.arranger.updateProgram();
    }

    markStep(step) {
        let len = this.cells.length;
        let pstep = (step + len - 1) % len;
        this.cells[pstep].deactivate();
        this.cells[step].activate();
    }
}

export { Pattern };
