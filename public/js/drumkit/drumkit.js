import { h, render, Component } from "../preact.js";
import { MultiTrackSequencer } from "./multi-track-sequencer.js";
import { instruments, levels } from "./kit.js";

class Drumkit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
    }

    toggleUI() {
        this.setState({
            collapsed: !this.state.collapsed
        }, () => {
            if (!this.state.collapsed) {
                window.scrollBy(100000, 0);
            }
        });
    }

    render() {
        return h(
            "div",
            { className: "drumkit" },
            h(MultiTrackSequencer, { instruments: instruments, ref: e => this.sequencer = e, collapsed: this.state.collapsed }),
            h(
                "div",
                { className: "multi-track-sequencer-ui-toggle", onClick: evt => this.toggleUI() },
                this.state.collapsed ? '▷' : '◁'
            )
        );
    }

    // A simple demo program.
    demo() {
        let s = this.sequencer;
        s.clear();
        for (let i = 0; i < 32; i++) {
            if ([0, 3, 8, 9, 11, 16, 19, 24, 25, 27].indexOf(i) > -1) {
                s.trigger(i, 'kick1');
                s.trigger(i, 'kick4', levels[1]);
            }
            if ((i + 4) % 8 === 0) {
                s.trigger(i, 'stick2');
                s.trigger(i + 1, 'stick2', levels[3]);
            }
            if ((i + 4) % 4 === 2) {
                s.trigger(i, 'ride2', levels[2]);
            }
            if (i !== 7 && i !== 23) {
                s.trigger(i, 'hihat2', levels[i % 4]);
            } else {
                s.trigger(i, 'hihat3');
                s.interrupt(i + 1, 'hihat3');
            }
        }
    }
}

export { Drumkit };