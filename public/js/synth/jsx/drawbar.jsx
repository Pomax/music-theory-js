import { h, render, Component } from '../preact.js';

import { Slider } from "./slider.js";

/**
 *
 */
class DrawBar extends Component {

    constructor(props) {
        super(props);
        this.generator = this.props.generator;
        let volume = this.volume = this.props.context.createGain();
        volume.gain.value = 1.0;
        volume.connect(this.props.master);
    }

    render() {
        return (
            <Slider label={this.props.label} value={this.props.value} onInput={evt => this.handleInput(evt)} />
        );
    }

    handleInput(value) {
        this.setValue(value);
    }

    setValue(value) {
        this.setState({ value });
        this.volume.gain.value = value;
    }

    getSource(note, velocity) {
        let source = this.generator.get(this.volume, 'sine', note + this.props.offset);
        return source;
    }
}

export { DrawBar }
