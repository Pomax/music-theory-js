import { h, render, Component } from '../preact.js';
import { context } from "../audio-context.js";

class GainKnob extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            fidelity: 1000
        };

        this.node = context.createGain();
        let destination = this.props.master;
        destination = destination ? destination : context;
        this.node.connect(destination);
    }

    render() {
        return h(
            "div",
            { className: "slider" },
            h(
                "label",
                null,
                this.props.labelText
            ),
            h("input", {
                type: "range",
                min: "0",
                max: this.state.fidelity,
                step: "1",
                value: this.state.value * this.state.fidelity,
                onInput: evt => this.handleInput(evt)
            })
        );
    }

    handleInput(evt) {
        let v = parseFloat(input.value) / this.fidelity;
        this.setValue(v);
    }

    setValue(value) {
        this.setState({ value });
        this.node.gain.value = value;
    }
}

export { GainKnob };