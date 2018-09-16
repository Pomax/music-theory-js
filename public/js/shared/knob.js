import { h, render, Component } from '../preact.js';
import { Slider } from "./slider.js";

class Knob extends Slider {

    constructor(props) {
        super(props);
        this.state.className = "knob";
    }
}

export { Knob };