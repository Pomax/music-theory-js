import { router } from "../../router/router.js";

/**
 *
 */
class LabelBar {
    constructor(controller, bar, container) {
        let div = document.createElement("div");
        container.appendChild(div);

        let label = document.createElement("label");
        label.textContent = bar.label;
        label.addEventListener("click", evt => {
            if (confirm("Adjust a single controller on your MIDI device after clicking OK,\nto rebind this slider, or hit cancel to keep the current binding.\n ")) {
                router.learnCC(controlcode => {
                    let idx = controller.list.indexOf(bar);
                    if (idx) {
                        delete controller.list[idx];
                        controller.list[controlcode] = bar;
                    }
                });
            }
        });
        div.appendChild(label);

        let input = bar.controller = document.createElement("input");
        let inputFidelity = 1000;
        input.setAttribute("type", "range");
        input.setAttribute("min", "0");
        input.setAttribute("step", "1");
        input.setAttribute("max", "1000");
        input.setAttribute("value", bar.value * inputFidelity);
        input.addEventListener("input", evt => {
            let v = parseFloat(input.value) / inputFidelity;
            bar.setValue(v);
        });
        div.appendChild(input);

        bar.setValue = v => {
            bar.value = v;
            bar.node.gain.value = v;
            let value = v * inputFidelity | 0;
            bar.controller.value = value;
            controller.onSetValue(bar, v);
        };
    }
}

export { LabelBar };