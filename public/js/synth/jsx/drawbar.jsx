import { h, render, Component } from '../preact.js';
import { Slider } from "./slider.js";
import { context } from "../shared/audio-context.js";

/**
 *
 */
class DrawBar extends Component {

    constructor(props) {
        super(props);
        this.generator = this.props.generator;
        let volume = this.volume = context.createGain();
        volume.gain.value = this.props.value;
        volume.connect(this.props.out);
    }

    render() {
        return (
            <Slider label={this.props.label} value={this.props.value} onInput={evt => this.handleInput(evt)} cc={this.props.cc}/>
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
