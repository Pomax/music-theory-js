class GainKnob {

    constructor(top, context, labelText, value, master) {
        this.context = context;
        this.node = context.createGain();
        this.master = master;

        if (master) {
            this.node.connect(master);
        } else {
            this.node.connect(context.destination);
        }

        this.value = value;
        this.fidelity = 1000;

        // set up HTML element
        let div =  document.createElement("div");
        let label = document.createElement("label");
        label.textContent = labelText;
        div.appendChild(label);
        let input = this.input = document.createElement("input");
        input.setAttribute("type", "range");
        input.setAttribute("min", "0");
        input.setAttribute("step", "1");
        input.setAttribute("max", this.fidelity);
        input.setAttribute("value", this.value * this.fidelity);

        input.addEventListener("input", evt => {
            let v = parseFloat(input.value)/this.fidelity;
            this.setValue(v);
        });
        div.appendChild(input);
        top.appendChild(div);

        this.html = div;
        this.setValue(value);
    }

    setValue(value) {
        this.value = value;
        this.node.gain.value = value;
        this.input.value = (value * this.fidelity)|0;
    }

    adjust(midiValue) {
        let step = 0.01 * (midiValue===64 ? 0 : midiValue - 64);
        let v = this.value;
        v += step;
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        this.setValue(v);
    }

    style(opts) {
        Object.keys(opts).forEach(key => (this.html.style[key] = opts[key]));
    }
}

export { GainKnob }
