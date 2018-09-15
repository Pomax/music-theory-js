import { h, render, Component } from '../preact.js';
import { AudioGenerator } from "./audio-generator.js";
import { DrawBar } from "./drawbar.js";
import { router } from "../router/router.js";
import { context } from "../audio-context.js";

const offsets = [[-12, 0, 7, 12, 19, 26, 31, 38]];

/**
 *
 */
class DrawBars extends Component {

    constructor(props) {
        super(props);
        router.addListener(this, "control");
        this.attack = 0.015;
        this.decay = 0.035;
        this.generator = new AudioGenerator(context); // no LFO for now
        this.setupDrawBars();
    }

    render() {
        return h(
            "div",
            { className: "drawbars" },
            this.DRAW_BARS
        );
    }

    onControl(controller, value) {
        let bar = this.DRAW_BARS[controller];
        if (bar) bar.api.setValue(value / 127);
    }

    setupDrawBars() {
        let tones = offsets[0];

        let definitions = [{ label: "sub-octave", value: 0.4 }, { label: "primary", value: 1.0 }, { label: "quint", value: 0.6 }, { label: "octave", value: 0.4 }, { label: "harmony 1", value: 0.2 }, { label: "harmony 2", value: 0.1 }, { label: "harmony 3", value: 0.0 }, { label: "harmony 4", value: 0.0 }];

        let normalizer = context.createGain();
        normalizer.gain.value = 1 / definitions.length;
        normalizer.connect(this.props.out);

        let DRAW_BARS = this.DRAW_BARS = [];

        // We conveniently start with CC 16-19 ("general purpose" 1-4) followed by CC 20-23 (undefined).
        definitions.forEach((def, i) => {
            let drawbar = h(DrawBar, {
                ref: e => drawbar.api = e,
                label: def.label,
                value: def.value,
                offset: tones[i],
                out: normalizer,
                generator: this.generator,
                cc: 16 + i
            });
            DRAW_BARS.push(drawbar);
        });
    }

    getSource(note, velocity) {
        velocity = velocity / 127;
        var osc = this.DRAW_BARS.map(drawbar => drawbar.api.getSource(note, velocity));
        return {
            start: () => osc.forEach(o => o.start(velocity, this.attack)),
            stop: () => osc.forEach(o => o.stop(this.decay))
        };
    }
}

export { DrawBars };