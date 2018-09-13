import { h, render, Component } from '../preact.js';

class Slider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            fidelity: 1000
        };
    }

    render() {
        return (
            <div className="slider">
                <label onClick={evt => this.learn()}>{ this.props.label }</label>
                <input
                  type="range"
                  min="0"
                  max={this.state.fidelity}
                  step="1"
                  value={this.state.value * this.state.fidelity}
                  onInput={evt => this.handleInput(evt)}
                />
            </div>
        );
    }

    learn() {
        console.log('trigger a CC learn pass');
    }

    handleInput(evt) {
        let value = parseFloat(evt.target.value)/this.state.fidelity;
        this.setState({ value });
        this.props.onInput(value);
    }
}

export { Slider }
