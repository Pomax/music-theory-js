import { Step } from "./step.js";

/**
 * ...
 */
class TonicStep extends Step {
    constructor(owner, top) {
        super(owner, top);
        this.selectors.tonic = ['I','i','II','ii','III','iii','IV','iv','V','v','VI','vi','VII','vii'];
        this.state.tonic = this.props.tonic || this.selectors.tonic[0];
    }
}

export { TonicStep };
