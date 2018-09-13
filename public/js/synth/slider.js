import { h, render, Component } from '../preact.js';
import { router } from "../router/router.js";

class Slider extends Component {

    constructor(props) {
        super(props);

        router.addListener(this, "control");

        this.state = {
            cc: this.props.cc,
            value: this.props.value,
            fidelity: 1000
        };
    }

    onControl(cc, value) {
        if (cc === this.state.cc) {
            value = value / 127;
            this.setState({ value });
            this.props.onInput(value);
        }
    }

    render() {
        return h(
            "div",
            { className: "slider" },
            h(
                "label",
                { onClick: evt => this.learnCC() },
                this.props.label
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

    learnCC() {
        if (confirm("Adjust a single controller on your MIDI device after clicking OK,\nto rebind this slider, or hit cancel to keep the current binding.\n ")) {
            router.learnCC(controlcode => {
                this.setState({ cc: controlcode });
            });
        }
    }

    handleInput(evt) {
        let value = parseFloat(evt.target.value) / this.state.fidelity;
        this.setState({ value });
        this.props.onInput(value);
    }
}

export { Slider };