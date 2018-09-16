import { h, render, Component } from '../preact.js';
import { router } from "../router/router.js";

class Slider extends Component {

    constructor(props) {
        super(props);

        router.addListener(this, "control");

        this.state = {
            cc: this.props.cc,
            value: this.props.value,
            fidelity: 1000,
            className: "slider"
        };
    }

    onControl(cc, value) {
        if(cc === this.state.cc) {
            value = (this.props.max||1) * value / 127;
            this.setState({ value });
            this.props.onInput(value);
        }
    }

    render() {
        return (
            <div className={this.state.className}>
                <label onClick={evt => {
                    if (this.props.disabled) return;
                    this.learnCC();
                }}>{ this.props.label }</label>
                <input
                  disabled={this.props.disabled}
                  type="range"
                  min={this.props.min || 0}
                  max={this.state.fidelity * (this.props.max || 1)}
                  step="1"
                  value={this.state.value * this.state.fidelity}
                  onInput={evt => this.handleInput(evt)}
                />
            </div>
        );
    }

    learnCC() {
        if (confirm("Adjust a single controller on your MIDI device after clicking OK,\nto rebind this slider, or hit cancel to keep the current binding.\n ")) {
            router.learnCC( controlcode => {
                this.setState({ cc: controlcode });
            });
        }
    }

    handleInput(evt) {
        let value = parseFloat(evt.target.value)/this.state.fidelity;
        this.setState({ value });
        this.props.onInput(value);
    }
}

export { Slider }
