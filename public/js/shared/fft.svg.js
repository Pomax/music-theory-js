import { h, render, Component } from "../preact.js";
import { router } from "../router/router.js";
import { context } from "./audio-context.js";

class FFT extends Component {
    constructor(props) {
        super(props);

        let analyser = this.analyser = context.createAnalyser();
        this.props.source.connect(analyser);
        this.dim = Math.pow(2, 8);
        analyser.fftSize = this.dim;
        let bufferLength = analyser.frequencyBinCount;
        let barWidth = this.barWidth = this.dim / bufferLength * 2.5;

        this.state = { dataArray: [] };
        this.update();
    }

    update() {
        let analyser = this.analyser;
        let dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        dataArray = Array.from(dataArray);
        this.setState({ dataArray });
        // We poll at a conservative rate, until there's something to actually
        // show, at which point we speed up the visualiser redraw.
        setTimeout(() => this.update(), dataArray.some(v => v > 0) ? 1000 / 24 : 1000 / 3);
    }

    render() {
        let data = this.state.dataArray;
        let height = 100;
        let width = this.dim * 2;
        let bar = this.barWidth;

        let values = data.map((value, i) => {
            let x = i * bar + bar / 2;
            return h("rect", { x: x, y: 0, width: bar, height: value / 255 * height });
        });

        return h(
            "svg",
            { viewBox: `0 0 ${width} ${height}` },
            h(
                "g",
                { transform: `translate(0,${height}) scale(1,-1)` },
                values
            )
        );
    }
}

export { FFT };