import { Step } from "./step.js";

/**
 * ...
 */
class TonicStep extends Step {
    constructor(owner, top) {
        super(owner, top);
        this.selectors.tonic = ['', 'I','i','II','ii','III','iii','IV','iv','V','v','VI','vi','VII','vii'];
        this.state.tonic = this.props.tonic
        if (typeof this.state.tonic === 'undefined') {
            this.state.tonic = this.selectors.tonic[1];
        }
    }
}

export { TonicStep };
